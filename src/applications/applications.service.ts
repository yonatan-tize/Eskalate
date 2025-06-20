import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DRIZZLE_ORM_TOKEN } from '../drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { applications, jobs, users } from '../db/schema';
import { and, count, eq } from 'drizzle-orm';
import { FindApplicationsDto } from './dto/find-applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto, applicantId: string) {
    const { jobId } = createApplicationDto;
    const existingApplication = await this.db
      .select()
      .from(applications)
      .where(and(eq(applications.jobId, jobId), eq(applications.applicantId, applicantId)));

    if (existingApplication.length > 0) {
      throw new BadRequestException('You have already applied for this job');
    }

    const newApplication = await this.db
      .insert(applications)
      .values({ ...createApplicationDto, applicantId, status: 'Applied' })
      .returning();
    return {
      Success: true,
      Message: 'Application created successfully.',
      Object: newApplication[0],
      Errors: null,
    };
  }

  async findMyApplications(
    applicantId: string,
    { page = 1, pageSize = 10 }: FindApplicationsDto,
  ) {
    const offset = (page - 1) * pageSize;
    const myApplications = await this.db
      .select({
        jobTitle: jobs.title,
        companyName: users.name,
        status: applications.status,
        appliedAt: applications.appliedAt,
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(users, eq(jobs.createdBy, users.id))
      .where(eq(applications.applicantId, applicantId))
      .limit(pageSize)
      .offset(offset);

    const total = await this.db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.applicantId, applicantId));

    return {
      Success: true,
      Message: 'Applications retrieved successfully.',
      Object: myApplications,
      PageNumber: page,
      PageSize: pageSize,
      TotalSize: total[0].count,
      Errors: null,
    };
  }

  async findJobApplications(
    jobId: string,
    userId: string,
    { page = 1, pageSize = 10 }: FindApplicationsDto,
  ) {
    const job = await this.db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job.length) {
      throw new NotFoundException('Job not found');
    }
    if (job[0].createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const offset = (page - 1) * pageSize;
    const jobApplications = await this.db
      .select({
        applicantName: users.name,
        resumeLink: applications.resumeLink,
        coverLetter: applications.coverLetter,
        status: applications.status,
        appliedAt: applications.appliedAt,
      })
      .from(applications)
      .leftJoin(users, eq(applications.applicantId, users.id))
      .where(eq(applications.jobId, jobId))
      .limit(pageSize)
      .offset(offset);

    const total = await this.db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.jobId, jobId));

    return {
      Success: true,
      Message: 'Job applications retrieved successfully.',
      Object: jobApplications,
      PageNumber: page,
      PageSize: pageSize,
      TotalSize: total[0].count,
      Errors: null,
    };
  }

  async updateStatus(
    id: string,
    { status }: UpdateApplicationDto,
    userId: string,
  ) {
    const application = await this.db.select().from(applications).where(eq(applications.id, id));
    if (!application.length) {
      throw new NotFoundException('Application not found');
    }

    const job = await this.db.select().from(jobs).where(eq(jobs.id, application[0].jobId));
    if (job[0].createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const updatedApplication = await this.db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();

    return {
      Success: true,
      Message: 'Application status updated successfully.',
      Object: updatedApplication[0],
      Errors: null,
    };
  }
}

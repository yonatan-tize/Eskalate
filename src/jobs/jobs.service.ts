import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DRIZZLE_ORM_TOKEN } from '../drizzle/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { jobs, users, applications } from '../db/schema';
import { and, count, eq, ilike, sql } from 'drizzle-orm';
import { FindJobsDto } from './dto/find-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    const newJob = await this.db
      .insert(jobs)
      .values({ ...createJobDto, createdBy: userId })
      .returning();
    return newJob[0];
  }

  async findMyJobs(userId: string, { page = 1, pageSize = 10 }: FindJobsDto) {
    const offset = (page - 1) * pageSize;
    const companyJobs = await this.db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        createdBy: jobs.createdBy,
        createdAt: jobs.createdAt,
        applicationCount: count(applications.id),
      })
      .from(jobs)
      .leftJoin(applications, eq(jobs.id, applications.jobId))
      .where(eq(jobs.createdBy, userId))
      .groupBy(jobs.id)
      .limit(pageSize)
      .offset(offset);

    const total = await this.db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.createdBy, userId));

    return {
      page,
      pageSize,
      total: total[0].count,
      data: companyJobs,
    };
  }

  async findOne(id: string) {
    const job = await this.db.select().from(jobs).where(eq(jobs.id, id));
    if (!job.length) {
      throw new NotFoundException('Job not found');
    }
    return job[0];
  }

  async update(id: string, updateJobDto: UpdateJobDto, userId: string) {
    const job = await this.findOne(id);
    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized access');
    }
    const updatedJob = await this.db
      .update(jobs)
      .set(updateJobDto)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob[0];
  }

  async remove(id: string, userId: string) {
    const job = await this.findOne(id);
    if (job.createdBy !== userId) {
      throw new UnauthorizedException('Unauthorized access');
    }
    await this.db.delete(jobs).where(eq(jobs.id, id));
    return { success: true, message: 'Job deleted successfully' };
  }

  async findAll({ page = 1, pageSize = 10, title, location, companyName }: FindJobsDto) {
    const offset = (page - 1) * pageSize;
    const whereConditions: any[] = [];
    if (title) {
      whereConditions.push(ilike(jobs.title, `%${title}%`));
    }
    if (location) {
      whereConditions.push(ilike(jobs.location, `%${location}%`));
    }
    if (companyName) {
      whereConditions.push(ilike(users.name, `%${companyName}%`));
    }

    const allJobs = await this.db
      .select()
      .from(jobs)
      .leftJoin(users, eq(jobs.createdBy, users.id))
      .where(and(...whereConditions))
      .limit(pageSize)
      .offset(offset);

    const total = await this.db
      .select({ count: count() })
      .from(jobs)
      .leftJoin(users, eq(jobs.createdBy, users.id))
      .where(and(...whereConditions));

    return {
      page,
      pageSize,
      total: total[0].count,
      data: allJobs.map((j) => j.jobs),
    };
  }
}

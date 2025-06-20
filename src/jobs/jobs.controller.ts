import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FindJobsDto } from './dto/find-jobs.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  create(@Body() createJobDto: CreateJobDto, @Req() req) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get('my-jobs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  findMyJobs(@Req() req, @Query() findJobsDto: FindJobsDto) {
    return this.jobsService.findMyJobs(req.user.id, findJobsDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  findAll(@Query() findJobsDto: FindJobsDto) {
    return this.jobsService.findAll(findJobsDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req) {
    return this.jobsService.update(id, updateJobDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  remove(@Param('id') id: string, @Req() req) {
    return this.jobsService.remove(id, req.user.id);
  }
}

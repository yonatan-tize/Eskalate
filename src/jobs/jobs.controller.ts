import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FindJobsDto } from './dto/find-jobs.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
@ApiTags('jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: 'Job created successfully.' })
  create(@Body() createJobDto: CreateJobDto, @Req() req) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get('my-jobs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Get jobs created by the current company' })
  @ApiQuery({ type: FindJobsDto })
  @ApiResponse({ status: 200, description: 'List of jobs created by the company.' })
  findMyJobs(@Req() req, @Query() findJobsDto: FindJobsDto) {
    return this.jobsService.findMyJobs(req.user.id, findJobsDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  @ApiOperation({ summary: 'Get all jobs (for applicants)' })
  @ApiQuery({ type: FindJobsDto })
  @ApiResponse({ status: 200, description: 'List of jobs.' })
  findAll(@Query() findJobsDto: FindJobsDto) {
    return this.jobsService.findAll(findJobsDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a job by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Job details.' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Update a job' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: 'Job updated successfully.' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req) {
    return this.jobsService.update(id, updateJobDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Delete a job' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Job deleted successfully.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.jobsService.remove(id, req.user.id);
  }
}

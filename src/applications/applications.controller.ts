import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../common/enums/role.enum';
import { FindApplicationsDto } from './dto/find-applications.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  @ApiOperation({ summary: 'Create application' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiResponse({ status: 201, description: 'Application created' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Req() req) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get('my-applications')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  @ApiOperation({ summary: 'Get my applications' })
  @ApiQuery({ type: FindApplicationsDto })
  @ApiResponse({ status: 200, description: 'List of user applications' })
  findMyApplications(@Req() req, @Query() findApplicationsDto: FindApplicationsDto) {
    return this.applicationsService.findMyApplications(req.user.id, findApplicationsDto);
  }

  @Get('job/:jobId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Get applications for a job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiQuery({ type: FindApplicationsDto })
  @ApiResponse({ status: 200, description: 'List of job applications' })
  findJobApplications(
    @Param('jobId') jobId: string,
    @Req() req,
    @Query() findApplicationsDto: FindApplicationsDto,
  ) {
    return this.applicationsService.findJobApplications(jobId, req.user.id, findApplicationsDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
  @ApiOperation({ summary: 'Update application status' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateApplicationDto })
  @ApiResponse({ status: 200, description: 'Application status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Req() req,
  ) {
    return this.applicationsService.updateStatus(id, updateApplicationDto, req.user.id);
  }
}

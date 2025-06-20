import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../common/enums/role.enum';
import { FindApplicationsDto } from './dto/find-applications.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  create(@Body() createApplicationDto: CreateApplicationDto, @Req() req) {
    return this.applicationsService.create(createApplicationDto, req.user.id);
  }

  @Get('my-applications')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.APPLICANT)
  findMyApplications(@Req() req, @Query() findApplicationsDto: FindApplicationsDto) {
    return this.applicationsService.findMyApplications(req.user.id, findApplicationsDto);
  }

  @Get('job/:jobId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.COMPANY)
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
  updateStatus(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Req() req,
  ) {
    return this.applicationsService.updateStatus(id, updateApplicationDto, req.user.id);
  }

}

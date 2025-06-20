import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsEnum } from 'class-validator';
import { applicationStatus } from '../../db/schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiPropertyOptional({ enum: applicationStatus.enumValues })
  @IsEnum(applicationStatus.enumValues)
  status: (typeof applicationStatus.enumValues)[number];
}

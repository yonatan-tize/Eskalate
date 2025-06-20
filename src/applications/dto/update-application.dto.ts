import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsEnum } from 'class-validator';
import { applicationStatus } from '../../db/schema';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsEnum(applicationStatus.enumValues)
  status: (typeof applicationStatus.enumValues)[number];
}

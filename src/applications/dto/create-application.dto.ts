import { IsString, IsUrl, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'UUID of the job' })
  @IsUUID()
  jobId: string;

  @ApiProperty({ description: 'URL to the resume' })
  @IsUrl()
  resumeLink: string;

  @ApiPropertyOptional({ description: 'Cover letter (max 200 chars)', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  coverLetter?: string;
}

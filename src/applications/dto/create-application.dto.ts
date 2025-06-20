import { IsString, IsUrl, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  jobId: string;

  @IsUrl()
  resumeLink: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  coverLetter?: string;
}

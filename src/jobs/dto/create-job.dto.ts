import { IsString, Length, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsString()
  @Length(20, 2000)
  description: string;

  @IsOptional()
  @IsString()
  location?: string;
}

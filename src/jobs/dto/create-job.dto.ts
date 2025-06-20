import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(20, 2000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}

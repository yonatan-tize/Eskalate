import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindApplicationsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  pageSize?: number = 10;
}

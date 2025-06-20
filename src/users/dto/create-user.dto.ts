import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
export class CreateUsersDto{
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @ApiProperty({ enum: ['applicant', 'company'] })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(8)
    @IsIn(['applicant', 'company'])
    role: string;
}
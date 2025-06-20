import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ example: "user@example.com", description: "User email address" })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "strongPassword123", description: "User password" })
    @IsString()
    @IsNotEmpty()
    password: string;
}

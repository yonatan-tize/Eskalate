import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUsersDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
    @ApiOperation({summary: 'allows new users to signup.'})
    @Post('signup')
    async signUp(@Body() user: CreateUsersDto){
        return await this.authService.signUp(user);
    }

    @ApiOperation({summary: 'allows users to signIn with the correct credentials'})
    @Post('signin')
    async signIn(@Body() user: SignInDto){
        return await this.authService.signIn(user);
    }
}

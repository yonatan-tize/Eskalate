import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto'; 
import { UsersService } from 'src/users/users.service';
import { CreateUsersDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/common/enums/role.enum';
@Injectable()
export class AuthService {
  constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}
    async signUp(user: CreateUsersDto) {

      const existingUser = await this.usersService.findOneByEmail(user.email);
      if (existingUser) {
        throw new HttpException('Email already in use', 400);
      }

      // Hash password and create user
      user.password = await bcrypt.hash(user.password, 10);
      return await this.usersService.create(user);
    }

    async signIn(user: SignInDto){
        //check if user exist
        const foundUser = await this.usersService.findOneByEmail(user.email);
        if(!foundUser){
            throw new HttpException('Wrong credentials', 401);
        };

        //check if password is correct
        const isPasswordCorrect = await bcrypt.compare(user.password, foundUser.password);
        if(!isPasswordCorrect){
            throw new HttpException('Wrong credentials', 401);
        }

        //generate token
        const payLoad = {
            sub: foundUser.id,
            role: foundUser.role
        };
        const jwt = await this.jwtService.signAsync(payLoad);

        //return token
        return { accessToken: jwt };
    };

    async validateUserByToken(token: string){
        try {
            console.log(token)
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.usersService.findOneById(payload.sub);

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword; // Return the user without the password field
        } catch (err) {
            throw new UnauthorizedException('Invalid token when parsing token');
        }
    }
}

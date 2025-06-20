import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_ORM_TOKEN } from '../drizzle/drizzle.provider';
import * as schema from '../db/schema';
import { users } from '../db/schema';
import { eq, count } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: CreateUsersDto) {
    const { name, email, password, role } = createUserDto;

    const newUser = await this.db
      .insert(users)
      .values({
        name,
        email,
        password,
        role: role as 'applicant' | 'company',
      })
      .returning();
    return newUser[0];
  }

  async findOneByEmail(email: string) {
    const user = await this.db.select().from(users).where(eq(users.email, email));
    return user[0];
  }

  async findOneById(id: string) {
    const user = await this.db.select().from(users).where(eq(users.id, id));
    return user[0];
  }

}
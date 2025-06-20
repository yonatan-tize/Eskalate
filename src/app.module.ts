import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [AuthModule, UsersModule, JobsModule, ApplicationsModule, DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

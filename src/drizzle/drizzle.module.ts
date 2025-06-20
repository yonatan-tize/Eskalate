import { Module } from '@nestjs/common';
import { DrizzleOrmProvider } from './drizzle.provider';

@Module({
  providers: [DrizzleOrmProvider],
  exports: [DrizzleOrmProvider],
})
export class DrizzleModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersResolver } from './users.resolver';
import { UserService } from './users.service';

import { Verification } from './entities/verification.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UserService, UsersResolver],
  exports: [UserService],
})
export class UsersModule {}

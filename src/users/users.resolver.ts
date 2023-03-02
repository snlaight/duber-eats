/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';

import {
  CreateAccountOutput,
  CreateAccountInput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { VerifyEmailOutput, VerifyEmailInput } from './dtos/verify-email.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';

import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly UserService: UserService) {}

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
   return this.UserService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.UserService.login(loginInput);
  }

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.UserService.findById(userProfileInput.userId);
  }

  @Role(['Any'])
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.UserService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail (@Args('input') { code }: VerifyEmailInput) : Promise<VerifyEmailOutput> {
    return this.UserService.verifyEmail(code);
  }
}

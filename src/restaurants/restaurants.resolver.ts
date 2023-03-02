/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetMetadata } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';

import { User, UserRole } from 'src/users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';


@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}

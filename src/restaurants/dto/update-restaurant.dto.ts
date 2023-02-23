/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRestaurantInputType extends PartialType(
  CreateRestaurantDto,
) {}

@InputType()
export class UpdateRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}

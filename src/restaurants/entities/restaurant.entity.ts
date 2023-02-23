/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;
}

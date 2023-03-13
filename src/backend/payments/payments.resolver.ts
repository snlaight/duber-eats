import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { AuthUser } from 'auth/auth-user.decorator';
import { Role } from 'auth/role.decorator';
import { User } from 'users/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payments.service';

import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';

@Resolver((of) => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation((returns) => CreatePaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() authUser: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return this.paymentService.createPayment(authUser, createPaymentInput);
  }

  @Query((returns) => GetPaymentsOutput)
  @Role(['Owner'])
  getPayments(@AuthUser() user: User): Promise<GetPaymentsOutput> {
    return this.paymentService.getPayments(user);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, Interval } from '@nestjs/schedule';

import { Restaurant } from 'restaurants/entities/restaurant.entity';
import { User } from 'users/entities/user.entity';
import { Payment } from './entities/payment.entity';

import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          id: restaurantId,
        },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }

      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do that.',
        };
      }

      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );

      restaurant.isPromoted = true;
      const date = new Date();
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;
      this.restaurants.save(restaurant);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create payment.',
      };
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({
        relations: {
          user: true,
        },
      });

      return {
        ok: true,
        payments,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not get payments.',
      };
    }
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      where: {
        isPromoted: true,
        promotedUntil: LessThan(new Date()),
      },
    });
    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    });
  }
}

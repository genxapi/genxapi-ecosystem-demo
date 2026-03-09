import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import payments from '../payments.json';

@Injectable()
export class PaymentsService {
  private readonly payments = payments as unknown as Payment[];

  getPayments(): Payment[] {
    return this.payments;
  }

  getPaymentById(paymentId: number): Payment {
    const payment = this.payments.find(({ id }) => id === paymentId);

    if (!payment) {
      throw new NotFoundException(`Payment ${paymentId} not found.`);
    }

    return payment;
  }

  getPaymentsByUserId(userId: number): Payment[] {
    return this.payments.filter((payment) => payment.userId === userId);
  }
}

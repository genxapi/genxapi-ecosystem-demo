import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
// import { AppService } from '../app.service';
import { Payment } from '../entities/payment.entity';

import db from '../payments.json';

@Controller('payments')
export class PaymentsController {
  constructor(/*private readonly appService: AppService*/) { }

  @Get()
  @ApiOperation({ summary: 'Return a list of all payments' })
  @ApiOkResponse({ type: Payment, isArray: true })
  getPayments() {
    return db;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'User ID of payments to retrieve', example: 1 })
  @ApiOperation({ summary: 'Return all payments done by a specific user' })
  @ApiOkResponse({ type: Payment, isArray: true })
  getUserPayments(@Param('id') givenUserId: string) {
    return db.filter(({ userId }) => userId === Number(givenUserId));
  }
}

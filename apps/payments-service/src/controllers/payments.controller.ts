import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { INTERNAL_ROLES, USER_ROLES, type AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Payment } from '../entities/payment.entity';
import { PaymentsService } from '../services/payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
@ApiForbiddenResponse({ description: 'Authenticated user does not have access to this route.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('me/payments')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Return the authenticated user payments' })
  @ApiOkResponse({ type: Payment, isArray: true })
  getMyPayments(@Req() request: AuthenticatedRequest) {
    return this.paymentsService.getPaymentsByUserId(Number(request.user.sub));
  }

  @Get('payments')
  @Roles(...INTERNAL_ROLES)
  @ApiOperation({ summary: 'Return a list of payments for internal support and admin tooling' })
  @ApiOkResponse({ type: Payment, isArray: true })
  getPayments() {
    return this.paymentsService.getPayments();
  }

  @Get('payments/:paymentId')
  @Roles(...INTERNAL_ROLES)
  @ApiParam({
    name: 'paymentId',
    type: Number,
    description: 'Payment ID to retrieve',
    example: 1001,
  })
  @ApiOperation({ summary: 'Return details of a specific payment for internal support and admin tooling' })
  @ApiOkResponse({ type: Payment })
  @ApiNotFoundResponse({ description: 'Payment was not found.' })
  getPayment(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  @Get('users/:userId/payments')
  @Roles(...INTERNAL_ROLES)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID to filter payments by', example: 1 })
  @ApiOperation({ summary: 'Return payments for a specific user for internal support and admin tooling' })
  @ApiOkResponse({ type: Payment, isArray: true })
  getUserPayments(@Param('userId', ParseIntPipe) userId: number) {
    return this.paymentsService.getPaymentsByUserId(userId);
  }
}

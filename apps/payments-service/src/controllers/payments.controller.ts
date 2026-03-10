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
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('me/payments')
  @Roles(...USER_ROLES)
  @ApiOperation({
    summary: 'Return the authenticated user payments',
    description:
      'Customer self-service route. The service resolves ownership from the JWT sub claim instead of trusting caller-supplied user ids.',
  })
  @ApiOkResponse({ type: Payment, isArray: true, description: 'Payments owned by the authenticated subject.' })
  getMyPayments(@Req() request: AuthenticatedRequest) {
    return this.paymentsService.getPaymentsByUserId(Number(request.user.sub));
  }

  @Get('payments')
  @Roles(...INTERNAL_ROLES)
  @ApiOperation({
    summary: 'Return the internal payments list',
    description: 'Read-only internal route for support and admin personas.',
  })
  @ApiOkResponse({ type: Payment, isArray: true, description: 'Internal payments list.' })
  @ApiForbiddenResponse({ description: 'Requires support or admin role.' })
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
  @ApiOperation({
    summary: 'Return an internal payment by paymentId',
    description:
      'Read-only internal route for support and admin personas. The route identifies a payment resource by paymentId; it is not a user-payment shortcut.',
  })
  @ApiOkResponse({ type: Payment, description: 'Requested payment resource.' })
  @ApiForbiddenResponse({ description: 'Requires support or admin role.' })
  @ApiNotFoundResponse({ description: 'Payment was not found.' })
  getPayment(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  @Get('users/:userId/payments')
  @Roles(...INTERNAL_ROLES)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID to filter payments by', example: 1 })
  @ApiOperation({
    summary: 'Return internal payments for a specific userId',
    description:
      'Read-only internal convenience route for support and admin personas. It filters payment resources by owning userId.',
  })
  @ApiOkResponse({
    type: Payment,
    isArray: true,
    description: 'Payments owned by the requested userId. Returns an empty array when that user has no payments.',
  })
  @ApiForbiddenResponse({ description: 'Requires support or admin role.' })
  getUserPayments(@Param('userId', ParseIntPipe) userId: number) {
    return this.paymentsService.getPaymentsByUserId(userId);
  }
}

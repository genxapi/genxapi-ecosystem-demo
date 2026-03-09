import { ApiProperty } from '@nestjs/swagger';

export class Payment {

  @ApiProperty({
    example: 1001,
    description: 'Unique payment identifier',
  })
  id!: number;

  @ApiProperty({
    example: 1,
    description: 'Foreign key referencing the user',
  })
  userId!: number;

  @ApiProperty({
    example: 199.99,
    description: 'Payment amount',
  })
  amount!: number;

  @ApiProperty({
    example: 'USD',
    description: 'ISO currency code',
  })
  currency!: string;

  @ApiProperty({
    enum: ['pending', 'completed', 'failed', 'refunded'],
    example: 'completed',
  })
  status!: string;

  @ApiProperty({
    enum: ['credit_card', 'paypal', 'bank_transfer', 'stripe'],
    example: 'credit_card',
  })
  method!: string;

  @ApiProperty({
    example: 'txn_8f3a21c9',
    description: 'External transaction reference',
  })
  transactionId!: string;

  @ApiProperty({
    example: '2025-02-01T10:15:00Z',
    format: 'date-time',
  })
  createdAt!: string;

  // Optional: relation example
  /*@ApiProperty({
    type: () => User,
    description: 'Associated user',
  })
  user?: User;*/
}

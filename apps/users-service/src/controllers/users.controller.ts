import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
// import { AppService } from '../app.service';
import { User } from '../entities/user.entity';

import db from '../users.json';

@Controller('users')
export class UsersController {
  constructor(/*private readonly appService: AppService*/) { }

  @Get()
  @ApiOperation({ summary: 'Return a list of all users' })
  @ApiOkResponse({ type: User, isArray: true })
  getUsers() {
    return db;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'User ID to retrieve', example: 1 })
  @ApiOperation({ summary: 'Return details of a specific user' })
  @ApiOkResponse({ type: User })
  getUser(@Param('id') userId: string) {
    const user = db.find(({ id }) => id === Number(userId));
    return user ?? null;
  }
}

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
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
@ApiForbiddenResponse({ description: 'Authenticated user does not have access to this route.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles(...USER_ROLES)
  @ApiOperation({ summary: 'Return the authenticated user profile' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: 'Authenticated user was not found.' })
  getMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.getUserById(Number(request.user.sub));
  }

  @Get('users')
  @Roles(...INTERNAL_ROLES)
  @ApiOperation({ summary: 'Return a list of users for internal support and admin tooling' })
  @ApiOkResponse({ type: User, isArray: true })
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('users/:userId')
  @Roles(...INTERNAL_ROLES)
  @ApiParam({ name: 'userId', type: Number, description: 'User ID to retrieve', example: 1 })
  @ApiOperation({ summary: 'Return details of a specific user for internal support and admin tooling' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({ description: 'User was not found.' })
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequest } from '../entities/login-request.entity';
import { LoginResponse } from '../entities/login-response.entity';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate a user and issue a bearer token',
    description:
      'Accepts seeded demo credentials and returns a JWT compatible with the secured users and payments contracts.',
  })
  @ApiBody({ type: LoginRequest })
  @ApiOkResponse({ type: LoginResponse, description: 'Authenticated session details.' })
  @ApiUnauthorizedResponse({ description: 'Credentials are invalid or the account is inactive.' })
  login(@Body() credentials: LoginRequest) {
    return this.authService.login(credentials);
  }
}

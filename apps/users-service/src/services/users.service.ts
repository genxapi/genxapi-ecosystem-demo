import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import users from '../users.json';

@Injectable()
export class UsersService {
  private readonly users = users as unknown as User[];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(userId: number): User {
    const user = this.users.find(({ id }) => id === userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found.`);
    }

    return user;
  }
}

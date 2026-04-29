import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfilePayload } from './user.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Headers('x-user-id') userId: string) {
    return this.userService.findProfileById(userId);
  }

  @Patch('me')
  async updateProfile(
    @Headers('x-user-id') userId: string,
    @Body() payload: UpdateUserProfilePayload,
  ) {
    return this.userService.updateProfile(userId, payload);
  }
}

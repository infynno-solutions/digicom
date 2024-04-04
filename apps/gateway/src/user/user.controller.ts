import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/auth.interface';
import { ConnectStripeDto } from '@repo/shared';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('payments/stripe')
  getStripe(@Req() req: IRequestWithUser) {
    return this.userService.getStripe(req.user);
  }

  @Post('payments/stripe')
  setupStripe(
    @Req() req: IRequestWithUser,
    @Body() connectStripeDto: ConnectStripeDto,
  ) {
    return this.userService.connectStripe(connectStripeDto, req.user);
  }
}

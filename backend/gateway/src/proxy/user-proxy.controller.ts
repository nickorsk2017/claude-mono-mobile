import { All, Controller, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ProxyService } from './proxy.service';
import { SupabaseAuthenticationGuard } from '../authentication/supabase-authentication.guard';

@Controller('users')
@UseGuards(SupabaseAuthenticationGuard)
export class UserProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {}

  @All('*')
  async proxy(@Req() request: Request): Promise<unknown> {
    const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL')!;
    const targetUrl = `${userServiceUrl}${request.path}`;
    return this.proxyService.forward(targetUrl, request);
  }
}

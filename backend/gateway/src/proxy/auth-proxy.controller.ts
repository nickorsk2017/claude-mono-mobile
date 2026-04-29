import { All, Controller, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller('auth')
export class AuthProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {}

  @All('*')
  async proxy(@Req() request: Request): Promise<unknown> {
    const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL')!;
    const targetUrl = `${authServiceUrl}${request.path}`;
    return this.proxyService.forward(targetUrl, request);
  }
}

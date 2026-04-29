import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProxyService } from './proxy.service';
import { AuthProxyController } from './auth-proxy.controller';
import { UserProxyController } from './user-proxy.controller';

@Module({
  imports: [
    HttpModule.register({ timeout: 10000 }),
    AuthenticationModule,
  ],
  providers: [ProxyService],
  controllers: [AuthProxyController, UserProxyController],
})
export class ProxyModule {}

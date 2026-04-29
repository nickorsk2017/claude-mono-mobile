import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async forward(targetUrl: string, request: Request): Promise<unknown> {
    const forwardedHeaders = this.buildForwardedHeaders(request);

    try {
      const observable = this.httpService.request({
        method: request.method,
        url: targetUrl,
        data: request.method !== 'GET' ? request.body : undefined,
        headers: forwardedHeaders,
        params: request.query,
      });
      const axiosResponse = await firstValueFrom(observable);
      return axiosResponse.data;
    } catch (error: unknown) {
      const { statusCode, message } = this.extractErrorDetails(error);
      throw new HttpException(message, statusCode);
    }
  }

  private buildForwardedHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (request.headers['x-user-id']) {
      headers['x-user-id'] = String(request.headers['x-user-id']);
    }
    if (request.headers['x-user-email']) {
      headers['x-user-email'] = String(request.headers['x-user-email']);
    }

    return headers;
  }

  private extractErrorDetails(error: unknown): { statusCode: number; message: string } {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data as { error?: string } | undefined;
      return {
        statusCode: error.response?.status ?? 502,
        message: responseData?.error ?? 'Upstream service unavailable',
      };
    }
    return { statusCode: 502, message: 'Upstream service unavailable' };
  }
}

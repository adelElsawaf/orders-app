
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

import { RateLimiterService } from '../rate-limiter/rate-limiter.service';
import { RateLimitOptions } from '../rate-limiter/rate-limiter.types';
import { RATE_LIMIT_KEY } from '../rate-limiter/decorators/rate-limiter.decorator';
import { RateLimitExceededException } from '../rate-limiter/exceptions/rate-limit-exceeded.exception';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.getRateLimitOptions(context);

    if (!options) return true;

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const identifier = this.getIdentifier(request);
    const key = `rate_limit:${identifier}`;

    const result = await this.rateLimiterService.consume(
      key,
      options.limit,
      options.windowMs,
    );

    response.setHeader('X-RateLimit-Limit', options.limit);
    response.setHeader('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
      const retryAfter = Math.ceil(result.retryAfter / 1000);

      response.setHeader('Retry-After', retryAfter);

      throw new RateLimitExceededException(
          retryAfter
      );
    }

    return true;
  }

  private getRateLimitOptions(
    context: ExecutionContext,
  ): RateLimitOptions | undefined {
    return this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );
  }

  private getIdentifier(request: Request): string {
    const ip = request.ip || request.socket.remoteAddress;

    return `ip:${ip}`;
  }
}

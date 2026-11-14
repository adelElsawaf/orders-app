
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../../common/redis/redis.constants';
import { SLIDING_WINDOW_SCRIPT } from './rate-limiter.constants';
import type { RateLimitResult } from './rate-limiter.types';

@Injectable()
export class RateLimiterService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async consume(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    if (
      !Number.isInteger(limit) ||
      limit <= 0 ||
      !Number.isInteger(windowMs) ||
      windowMs <= 0
    ) {
      throw new BadRequestException(
        'Limit and windowMs must be positive integers',
      );
    }

    const result = await this.redis.eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      windowMs,
      limit,
      randomUUID(),
    ) as [number, number, number];

    const [allowed, remaining, retryAfter] = result;

    return {
      allowed: allowed === 1,
      remaining,
      retryAfter,
    } satisfies RateLimitResult;
  }
}

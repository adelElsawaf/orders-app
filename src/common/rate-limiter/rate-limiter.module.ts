
import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { RateLimiterService } from './rate-limiter.service';

@Module({
  imports: [RedisModule],
  providers: [
    RateLimiterService,
    RateLimitGuard,
  ],
  exports: [
    RateLimiterService,
    RateLimitGuard,
  ],
})
export class RateLimiterModule {}

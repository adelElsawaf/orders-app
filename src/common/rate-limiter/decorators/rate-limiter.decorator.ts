
import { SetMetadata } from '@nestjs/common';
import { RateLimitOptions } from '../rate-limiter.types';

export const RATE_LIMIT_KEY = 'rate_limit';

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

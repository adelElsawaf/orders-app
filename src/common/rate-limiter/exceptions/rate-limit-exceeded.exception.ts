
import { HttpStatus } from '@nestjs/common';

import { BaseException } from '../../exceptions/base-exception';

export class RateLimitExceededException extends BaseException {
  constructor(retryAfter: number) {
    super(
      `Too many requests. Retry after ${retryAfter} seconds.`,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}

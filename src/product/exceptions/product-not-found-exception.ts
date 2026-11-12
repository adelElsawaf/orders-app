import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions/base-exception';

export class ProductNotFoundException extends BaseException {
  constructor(productId: number) {
    super(`Product with ID ${productId} not found`, HttpStatus.NOT_FOUND);
  }
}

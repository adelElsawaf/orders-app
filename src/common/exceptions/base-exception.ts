import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        success: false,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
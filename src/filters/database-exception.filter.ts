import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { MysqlErrorCodes } from 'mysql-error-codes';
import { ConfigService } from '@nestjs/config';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: TypeORMError, host: ArgumentsHost) {
    // debugger;
    const ctx = host.switchToHttp();
    // const request = ctx.getRequest();
    const response = ctx.getResponse();
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = 'Database error';
    // console.log(request.body);

    if (exception instanceof QueryFailedError) {
      if (exception.driverError.errno === MysqlErrorCodes.ER_DUP_ENTRY) {
        message = 'Duplicate entry';
        statusCode = HttpStatus.CONFLICT;
      }
    }

    if (this.configService.get('NODE_ENV') === 'development') {
      response.status(statusCode).json({
        statusCode,
        stack: exception.stack,
        message: exception.message,
      });
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@/utils/log4js';

@Catch()
export class ServerExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = ` RequestUrl: ${req.originalUrl}, Method: ${req.method}, IP: ${req.ip}, User: ${
      req.user ? req.user.id : null
    }
  Status code: ${status}
  Response: ${exception} \n
  `;

    Logger.error(logFormat);

    console.log(exception);
    response.status(status).json({
      statusCode: status,
      msg: exception,
    });
  }
}

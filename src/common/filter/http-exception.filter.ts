import { ExceptionFilter, Catch, ArgumentsHost, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@/utils/log4js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();
    const status = exception.getStatus();

    const logFormat = ` RequestUrl: ${req.originalUrl}, Method: ${req.method}, IP: ${req.ip}, User: ${
      req.user ? req.user.id : null
    }
  Status code: ${status}
  Response: ${exception} \n
  `;

    Logger.info(logFormat);
    response.status(status).json({
      statusCode: status,
      error: exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
    });
  }
}

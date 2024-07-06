import { Response } from 'express';
import { ERROR_MESSAGE } from './constant';

export class ResponseHandler {
  static success(res: Response, message: string, data: any, statusCode = 200) {
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string | unknown | Error,
    statusCode = 401,
    status = 'Bad Request'
  ) {
    let errorMessage = message instanceof Error ? message.message : message;
    if (res.locals.routeName === 'register' && !errorMessage) {
      errorMessage = ERROR_MESSAGE.AUTH.REGISTRATION_ERROR;
    } else if (res.locals.routeName === 'login' && !errorMessage) {
      errorMessage = ERROR_MESSAGE.AUTH.LOGIN_ERROR;
    }
    res.status(statusCode).json({
      status: status,
      message: errorMessage,
      statusCode,
    });
  }
}

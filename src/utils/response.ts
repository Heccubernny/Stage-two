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
    status: string = 'Bad Request',
    routeName: string = ''
  ) {
    let errorMessage = message instanceof Error ? message.message : message;
    if (!errorMessage) {
      switch (routeName) {
        case 'register':
          return ERROR_MESSAGE.AUTH.REGISTRATION_ERROR;
        case 'login':
          return ERROR_MESSAGE.AUTH.LOGIN_ERROR;
        default:
          return ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN;
      }
    }
    res.status(statusCode).json({
      status: status,
      message: errorMessage,
      statusCode,
    });
  }
}

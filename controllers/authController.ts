import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { RegisterResponse } from '../interfaces/registerInterface';
import { AuthService } from '../services/authService';
import { CustomValidationException } from '../utils/common/exception';
import {
  ERROR_MESSAGE,
  ROUTE_NAME,
  SUCCESS_RESPONSE_CONSTANT,
} from '../utils/constant';
import { ResponseHandler } from '../utils/response';
export class AuthController {
  static async register(req: Request, res: Response<RegisterResponse>) {
    res.locals.routeName = ROUTE_NAME.AUTH.REGISTER;
    try {
      const data = await AuthService.register(req.body);
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.AUTH.REGISTER_SUCCESS,
        data,
        HttpStatusCodes.CREATED
      );
    } catch (error: unknown) {
      if (error instanceof CustomValidationException) {
        return error.handle(res);
      }
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : new Error(ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN),
        401,
        'Bad Request',
        res.locals.routeName
      );
    }
  }

  static async login(req: Request, res: Response) {
    res.locals.routeName = ROUTE_NAME.AUTH.LOGIN;

    try {
      const data = await AuthService.login(req.body);
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.AUTH.LOGIN_SUCCESS,
        data,
        HttpStatusCodes.CREATED
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        error instanceof Error
          ? error.message
          : new Error(ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN),
        401,
        'Bad Request',
        res.locals.routeName
      );
    }
  }
}

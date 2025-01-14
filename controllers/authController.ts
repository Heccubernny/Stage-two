import { Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { AuthService } from "../services/authService";
import {
  ERROR_MESSAGE,
  ROUTE_NAME,
  SUCCESS_RESPONSE_CONSTANT,
} from "../utils/constant";
import { ResponseHandler } from "../utils/response";
export class AuthController {
  static async register(req: Request, res: Response) {
    res.locals.routeName = ROUTE_NAME.AUTH.REGISTER;
    try {
      // const {
      //   firstName,
      //   lastName,
      //   email,
      //   password,
      //   phone,
      // }: { firstName: string; lastName: string; email: string; password: string; phone: string; } = req.body;
      const data = await AuthService.register(req.body);
      console.log("Data: ", data);
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.AUTH.REGISTER_SUCCESS,
        data,
        HttpStatusCodes.CREATED
      );
    } catch (error: unknown) {
      // if ( error instanceof CustomValidationException ) {
      //   return error.handle( res );
      // } else {
      //   console.log( "Data " );

      ResponseHandler.error(
        res,
        new Error(ERROR_MESSAGE.AUTH.REGISTRATION_ERROR),
        HttpStatusCodes.BAD_REQUEST,
        "Bad request",
        res.locals.routeName
      );
      // }
    }
  }
  static async login(req: Request, res: Response) {
    res.locals.routeName = ROUTE_NAME.AUTH.LOGIN;

    try {
      const data = await AuthService.login(req.body);
      console.log("Data: ", data);

      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.AUTH.LOGIN_SUCCESS,
        data,
        HttpStatusCodes.OK
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        new Error(ERROR_MESSAGE.AUTH.LOGIN_ERROR),
        401,
        "Bad request",
        res.locals.routeName
      );
    }
  }
}

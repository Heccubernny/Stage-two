import { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { UserService } from '../services/userService';
import { ERROR_MESSAGE, SUCCESS_RESPONSE_CONSTANT } from '../utils/constant';
import { ResponseHandler } from '../utils/response';

class UserController {
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;

    const requesterId = (req as any).user.userId;

    try {
      const user = await UserService.findUserById(userId);
      if (!user) {
        return ResponseHandler.error(
          res,
          'User not found',
          HttpStatusCodes.NOT_FOUND
        );
      }

      const hasAccess = await UserService.checkUserAccess(userId, requesterId);
      if (!hasAccess) {
        return ResponseHandler.error(
          res,
          ERROR_MESSAGE.DEFAULT_ERROR.FORBIDDEN,
          HttpStatusCodes.FORBIDDEN
        );
      }

      const data = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      };
      ResponseHandler.success(
        res,
        SUCCESS_RESPONSE_CONSTANT.USER.RETREIVE_SUCCESS,
        data
      );
    } catch (error) {
      console.error(error);
      ResponseHandler.error(
        res,
        ERROR_MESSAGE.DEFAULT_ERROR.INTERNAL,
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new UserController();

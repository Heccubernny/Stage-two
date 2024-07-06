import { NextFunction, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../interfaces/authInterface';

class AuthMiddleware {
  static authenticateJWT(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
      }
      jwt.verify(token, process.env.HNG_JWT_SECRET!, (err, user) => {
        if (err) {
          return res.sendStatus(HttpStatusCodes.FORBIDDEN);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }
  }
}

export default AuthMiddleware;

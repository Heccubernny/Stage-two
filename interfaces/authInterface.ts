import { Request } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

interface SignJwtTokenInterface {
  userId: string;
}

export { CustomRequest, SignJwtTokenInterface };

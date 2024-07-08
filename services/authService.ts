import bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import dotenv from 'dotenv';
import { response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data_source';
import { Organisation } from '../entities/Organisation';
import { User } from '../entities/User';
import { CustomValidationException } from '../utils/common/exception';
import { ERROR_MESSAGE } from '../utils/constant';
import { ResponseHandler } from '../utils/response';
dotenv.config();
type RegistrationType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

type LoginType = {
  email: string;
  password: string;
};

export class AuthService {
  static async register({
    firstName,
    lastName,
    email,
    password,
    phone,
  }: RegistrationType) {
    const userRespository = AppDataSource.getRepository(User);
    const organisationRespository = AppDataSource.getRepository(Organisation);
    const saltLength = 10;

    const doesEmailExist = await userRespository.exists({ where: { email } });

    if (doesEmailExist) {
      ResponseHandler.error(
        response,
        ERROR_MESSAGE.AUTH.REGISTRATION_ERROR,
        422
      );
    }

    const hashPassword = bcrypt.hashSync(password, saltLength);
    let user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashPassword;
    user.phone = phone;

    const errors = await validate(user);
    if (errors.length > 0) {
      throw new CustomValidationException(errors);
    }

    await userRespository.save(user);

    let organisation = new Organisation();
    organisation.name = `${firstName}'s Organisation`;
    organisation.users = [user];
    await organisationRespository.save(organisation);

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.HNG_JWT_SECRET!,
      { expiresIn: process.env.EXPIRES_IN }
    );

    return {
      accessToken,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  static async login({ email, password }: LoginType) {
    const userRespository = AppDataSource.getRepository(User);
    const user: User | null = await userRespository.findOneBy({ email });

    if (!user) {
      throw new Error(ERROR_MESSAGE.AUTH.LOGIN_ERROR);
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error(ERROR_MESSAGE.AUTH.LOGIN_ERROR);
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.HNG_JWT_SECRET!,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    return {
      accessToken,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}

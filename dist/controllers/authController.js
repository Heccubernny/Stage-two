'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const class_validator_1 = require('class-validator');
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const data_source_1 = require('../data-source');
const Organisation_1 = require('../entities/Organisation');
const User_1 = require('../entities/User');
const app_1 = require('../utils/payload/app');
class AuthController {
  static register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { firstName, lastName, email, password, phone } = req.body;
      const userRespository = data_source_1.AppDataSource.getRepository(
        User_1.User
      );
      const organisationRespository = data_source_1.AppDataSource.getRepository(
        Organisation_1.Organisation
      );
      const saltLength = 10;
      const hashPassword = bcryptjs_1.default.hashSync(password, saltLength);
      let user = new User_1.User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = hashPassword;
      user.phone = phone;
      const errors = yield (0, class_validator_1.validate)(user);
      if (errors.length > 0) {
        app_1.AppPayload.appValidationErrorResponse(res, errors);
      }
      try {
        yield userRespository.save(user);
        let organisation = new Organisation_1.Organisation();
        organisation.name = `${firstName}'s Organisation`;
        organisation.users = [user];
        yield organisationRespository.save(organisation);
        const token = jsonwebtoken_1.default.sign(
          { userId: user.userId },
          process.env.HNG_JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );
        res.status(201).json({
          status: 'success',
          message: 'Registration successful',
          data: {
            accessToken: token,
            user: {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            },
          },
        });
      } catch (error) {
        res.status(400).json({
          status: 'Bad request',
          message: 'Registration unsuccessful',
          statusCode: 400,
        });
      }
    });
  }
  static login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, password } = req.body;
      const userRespository = data_source_1.AppDataSource.getRepository(
        User_1.User
      );
      const user = yield userRespository.findOneBy({ email });
      const comparePassword = yield bcryptjs_1.default.compare(
        password,
        user.password
      );
      if (!user || !comparePassword) {
        return res.status(401).json({
          status: 'Bad request',
          message: 'Authentication failed',
          statusCode: 401,
        });
      }
      const token = jsonwebtoken_1.default.sign(
        { userId: user.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: token,
          user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          },
        },
      });
    });
  }
}
exports.AuthController = AuthController;
// remains login

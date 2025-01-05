'use strict';
var __awaiter =
  ( this && this.__awaiter ) ||
  function ( thisArg, _arguments, P, generator )
  {
    function adopt ( value )
    {
      return value instanceof P
        ? value
        : new P( function ( resolve )
        {
          resolve( value );
        } );
    }
    return new ( P || ( P = Promise ) )( function ( resolve, reject )
    {
      function fulfilled ( value )
      {
        try
        {
          step( generator.next( value ) );
        } catch ( e )
        {
          reject( e );
        }
      }
      function rejected ( value )
      {
        try
        {
          step( generator[ 'throw' ]( value ) );
        } catch ( e )
        {
          reject( e );
        }
      }
      function step ( result )
      {
        result.done
          ? resolve( result.value )
          : adopt( result.value ).then( fulfilled, rejected );
      }
      step( ( generator = generator.apply( thisArg, _arguments || [] ) ).next() );
    } );
  };
var __importDefault =
  ( this && this.__importDefault ) ||
  function ( mod )
  {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty( exports, '__esModule', { value: true } );
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault( require( 'bcryptjs' ) );
const class_validator_1 = require( 'class-validator' );
const jsonwebtoken_1 = __importDefault( require( 'jsonwebtoken' ) );
const data_source_1 = require( '../data-source' );
const Organisation_1 = require( '../entities/Organisation' );
const User_1 = require( '../entities/User' );
const exception_1 = require( '../utils/common/exception' );
const constant_1 = require( '../utils/constant' );
class AuthService
{
  static register ( _a )
  {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* ( { firstName, lastName, email, password, phone } )
      {
        const userRespository = data_source_1.AppDataSource.getRepository(
          User_1.User
        );
        const organisationRespository =
          data_source_1.AppDataSource.getRepository(
            Organisation_1.Organisation
          );
        const saltLength = 10;
        const doesEmailExist = yield userRespository.exists( {
          where: { email },
        } );
        if ( doesEmailExist )
        {
          throw new Error( constant_1.ERROR_MESSAGE.AUTH.REGISTRATION_ERROR );
        }
        const hashPassword = bcryptjs_1.default.hashSync( password, saltLength );
        let user = new User_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = hashPassword;
        user.phone = phone;
        const errors = yield ( 0, class_validator_1.validate )( user );
        if ( errors.length > 0 )
        {
          throw new exception_1.CustomValidationException( errors );
        }
        yield userRespository.save( user );
        let organisation = new Organisation_1.Organisation();
        organisation.name = `${ firstName }'s Organisation`;
        organisation.users = [ user ];
        yield organisationRespository.save( organisation );
        const accessToken = jsonwebtoken_1.default.sign(
          { userId: user.userId },
          process.env.APP__JWT_SECRET,
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
    );
  }
  static login ( _a )
  {
    return __awaiter( this, arguments, void 0, function* ( { email, password } )
    {
      const userRespository = data_source_1.AppDataSource.getRepository(
        User_1.User
      );
      const user = yield userRespository.findOneBy( { email } );
      if ( !user )
      {
        throw new Error( constant_1.ERROR_MESSAGE.AUTH.LOGIN_ERROR );
      }
      const comparePassword = yield bcryptjs_1.default.compare(
        password,
        user.password
      );
      if ( !comparePassword )
      {
        throw new Error( constant_1.ERROR_MESSAGE.AUTH.LOGIN_ERROR );
      }
      const token = jsonwebtoken_1.default.sign(
        { userId: user.userId },
        process.env.APP__JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );
      return {
        token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      };
    } );
  }
}
exports.AuthService = AuthService;

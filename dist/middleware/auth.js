"use strict";
var __importDefault = ( this && this.__importDefault ) || function ( mod )
{
    return ( mod && mod.__esModule ) ? mod : { "default": mod };
};
Object.defineProperty( exports, "__esModule", { value: true } );
const http_status_codes_1 = __importDefault( require( "http-status-codes" ) );
const jsonwebtoken_1 = __importDefault( require( "jsonwebtoken" ) );
class AuthMiddleware
{
    static authenticateJWT ( req, res, next )
    {
        const authHeader = req.headers.authorization;
        if ( authHeader )
        {
            const token = authHeader.split( ' ' )[ 1 ];
            if ( !token )
            {
                return res.sendStatus( http_status_codes_1.default.UNAUTHORIZED );
            }
            jsonwebtoken_1.default.verify( token, process.env.APP__JWT_SECRET, ( err, user ) =>
            {
                if ( err )
                {
                    return res.sendStatus( http_status_codes_1.default.FORBIDDEN );
                }
                req.user = user;
                next();
            } );
        }
        else
        {
            res.sendStatus( http_status_codes_1.default.UNAUTHORIZED );
        }
    }
}
exports.default = AuthMiddleware;

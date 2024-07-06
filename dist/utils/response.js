"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const constant_1 = require("./constant");
class ResponseHandler {
    static success(res, message, data, statusCode = 200) {
        res.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    }
    static error(res, message, statusCode = 401, status = 'Bad Request') {
        let errorMessage = message instanceof Error ? message.message : message;
        if (res.locals.routeName === 'register' && !errorMessage) {
            errorMessage = constant_1.ERROR_MESSAGE.AUTH.REGISTRATION_ERROR;
        }
        else if (res.locals.routeName === 'login' && !errorMessage) {
            errorMessage = constant_1.ERROR_MESSAGE.AUTH.LOGIN_ERROR;
        }
        res.status(statusCode).json({
            status: status,
            message: errorMessage,
            statusCode,
        });
    }
}
exports.ResponseHandler = ResponseHandler;

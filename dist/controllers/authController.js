"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const authService_1 = require("../services/authService");
const exception_1 = require("../utils/common/exception");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.locals.routeName = constant_1.ROUTE_NAME.AUTH.REGISTER;
            try {
                const data = yield authService_1.AuthService.register(req.body);
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.AUTH.REGISTER_SUCCESS, data, http_status_codes_1.default.CREATED);
            }
            catch (error) {
                if (error instanceof exception_1.CustomValidationException) {
                    return error.handle(res);
                }
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN));
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.locals.routeName = constant_1.ROUTE_NAME.AUTH.LOGIN;
            try {
                const data = yield authService_1.AuthService.login(req.body);
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.AUTH.LOGIN_SUCCESS, data, http_status_codes_1.default.CREATED);
            }
            catch (error) {
                response_1.ResponseHandler.error(res, error instanceof Error
                    ? error.message
                    : new Error(constant_1.ERROR_MESSAGE.DEFAULT_ERROR.UNKNOWN));
            }
        });
    }
}
exports.AuthController = AuthController;

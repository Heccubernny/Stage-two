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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const userService_1 = require("../services/userService");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
class UserController {
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const requesterId = req.user.userId;
            try {
                const user = yield userService_1.UserService.findUserById(userId);
                if (!user) {
                    return response_1.ResponseHandler.error(res, 'User not found', http_status_codes_1.default.NOT_FOUND);
                }
                const hasAccess = yield userService_1.UserService.checkUserAccess(userId, requesterId);
                if (!hasAccess) {
                    return response_1.ResponseHandler.error(res, constant_1.ERROR_MESSAGE.DEFAULT_ERROR.FORBIDDEN, http_status_codes_1.default.FORBIDDEN);
                }
                const data = {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                };
                response_1.ResponseHandler.success(res, constant_1.SUCCESS_RESPONSE_CONSTANT.USER.RETREIVE_SUCCESS, data);
            }
            catch (error) {
                console.error(error);
                response_1.ResponseHandler.error(res, constant_1.ERROR_MESSAGE.DEFAULT_ERROR.INTERNAL, http_status_codes_1.default.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = new UserController();

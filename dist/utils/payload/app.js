"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPayload = void 0;
const http_status_codes_1 = require("http-status-codes");
class AppPayload {
    constructor(res, status, code, data, message) {
        res.status(code).json({
            status: status,
            message: message,
            data: data,
        });
    }
    static appSuccessResponse(res, status, code, data, message) {
        return new AppPayload(res, 'success', http_status_codes_1.StatusCodes.OK, data, message !== null && message !== void 0 ? message : '');
    }
    static appErrorResponse(res, status, code, data, message) {
        return new AppPayload(res, 'error', code !== null && code !== void 0 ? code : http_status_codes_1.StatusCodes.BAD_REQUEST, data, message !== null && message !== void 0 ? message : '');
    }
    static appValidationErrorResponse(res, errors) {
        return res.status(422).json({
            errors: errors.map((error) => ({
                field: error.property,
                message: Object.values(error.constraints).join(', '),
            })),
        });
    }
}
exports.AppPayload = AppPayload;

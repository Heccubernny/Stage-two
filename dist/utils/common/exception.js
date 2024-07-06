"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationException = void 0;
class CustomValidationException extends Error {
    constructor(errors) {
        super('Validation failed');
        this.statusCode = 422;
        this.errors = errors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints).join(', '),
        }));
    }
    handle(res) {
        res.status(this.statusCode).json({
            status: 'Bad Request',
            errors: this.errors,
            message: this.errors
                .map((err) => `${err.field}: ${err.message}`)
                .join(', '),
        });
    }
}
exports.CustomValidationException = CustomValidationException;

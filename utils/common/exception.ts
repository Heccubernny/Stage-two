import { Response } from 'express';

export class CustomValidationException extends Error {
  statusCode: number;
  errors: any[];

  constructor(errors: any[]) {
    super('Validation failed');
    this.statusCode = 422;
    this.errors = errors.map((error) => ({
      field: error.property,
      message: Object.values(error.constraints).join(', '),
    }));
  }

  handle(res: Response) {
    res.status(this.statusCode).json({
      status: 'Bad Request',
      errors: this.errors,
      message: this.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join(', '),
    });
  }
}

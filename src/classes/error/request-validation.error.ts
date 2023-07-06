import { ValidationError } from "express-validator";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../enums/v1";
import { CustomErrorFormatType } from "../../types/v1/errors";
import { RequestValidationErrorType } from "../../types/v1";
import { CustomError } from "../../classes/abstract/error";

export class RequestValidationError extends CustomError {
  isOperational: boolean = true;
  statusCode: ResponseStatusCodeEnum = ResponseStatusCodeEnum.BAD;
  constructor(private readonly errors: ValidationError[]) {
    super("Invalid Request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors(): CustomErrorFormatType {
    const formatErrors: RequestValidationErrorType[] = this.errors.map((el) => {
      return {
        message: el.msg,
        field: el.type,
      };
    });

    return {
      status: ResponseStatusSignalEnum.FAILED,
      errors: formatErrors,
    };
  }
}

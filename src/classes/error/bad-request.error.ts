import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../enums/v1";
import { CustomErrorFormatType } from "../../types/v1/errors";
import { CustomError } from "../abstract/error";

export class BadRequestError extends CustomError {
  isOperational: boolean = true;
  statusCode: ResponseStatusCodeEnum = ResponseStatusCodeEnum.BAD;

  constructor(private readonly reason: string) {
    super("Bad Request");
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors(): CustomErrorFormatType {
    return {
      status: ResponseStatusSignalEnum.FAILED,
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}

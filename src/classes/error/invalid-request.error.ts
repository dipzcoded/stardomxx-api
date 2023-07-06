import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../enums/v1";
import { CustomErrorFormatType } from "../../types/v1/errors";
import { CustomError } from "../../classes/abstract/error";

export class InvalidRequestError extends CustomError {
  isOperational: boolean = true;
  statusCode: ResponseStatusCodeEnum = ResponseStatusCodeEnum.INVALID;
  constructor(private readonly reason: string) {
    super("Bad Request");
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
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

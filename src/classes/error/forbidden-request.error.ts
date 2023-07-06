import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../enums/v1";
import { CustomErrorFormatType } from "../../types/v1/errors";
import { CustomError } from "../../classes/abstract/error";

export class ForbiddenError extends CustomError {
  isOperational: boolean = true;
  statusCode: ResponseStatusCodeEnum = ResponseStatusCodeEnum.FORBIDDEN;
  constructor(private readonly reason: string) {
    super("Forbidden Request");
    Object.setPrototypeOf(this, ForbiddenError.prototype);
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

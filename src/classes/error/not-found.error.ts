import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../enums/v1";
import { CustomErrorFormatType } from "../../types/v1/errors";
import { CustomError } from "../../classes/abstract/error";

export class NotFoundError extends CustomError {
  isOperational: boolean = true;
  statusCode: ResponseStatusCodeEnum = ResponseStatusCodeEnum.NOT_FOUND;
  constructor(private readonly reason: string) {
    super("NotFound Request");
    Object.setPrototypeOf(this, NotFoundError.prototype);
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

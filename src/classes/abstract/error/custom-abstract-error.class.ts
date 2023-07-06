import { ResponseStatusCodeEnum } from "../../../enums/v1";
import { CustomErrorFormatType } from "../../../types/v1/errors";

export abstract class CustomError extends Error {
  abstract statusCode: ResponseStatusCodeEnum;
  abstract isOperational: boolean;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): CustomErrorFormatType;
}

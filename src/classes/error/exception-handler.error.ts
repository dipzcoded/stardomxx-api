import { Response } from "express";
import { CustomError } from "../../classes/abstract/error";
import { ResponseStatusCodeEnum } from "../../enums/v1";

class ExceptionHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof CustomError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(error: Error | CustomError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as CustomError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(error: CustomError, response: Response): void {
    response.status(error.statusCode).json(error.serializeErrors());
  }

  private handleCriticalError(
    error: Error | CustomError,
    response?: Response
  ): void {
    if (response) {
      response
        .status(ResponseStatusCodeEnum.SERVER_ERROR)
        .json({ message: "internal server error" });
    }

    // console.log("Application encountered a critical error. Exiting");
    process.exit(1);
  }
}

export const exceptionHandler = new ExceptionHandler();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionHandler = void 0;
const error_1 = require("../../classes/abstract/error");
const v1_1 = require("../../enums/v1");
class ExceptionHandler {
    isTrustedError(error) {
        if (error instanceof error_1.CustomError) {
            return error.isOperational;
        }
        return false;
    }
    handleError(error, response) {
        if (this.isTrustedError(error) && response) {
            this.handleTrustedError(error, response);
        }
        else {
            this.handleCriticalError(error, response);
        }
    }
    handleTrustedError(error, response) {
        response.status(error.statusCode).json(error.serializeErrors());
    }
    handleCriticalError(error, response) {
        if (response) {
            response
                .status(v1_1.ResponseStatusCodeEnum.SERVER_ERROR)
                .json({ message: "internal server error" });
        }
        // console.log("Application encountered a critical error. Exiting");
        process.exit(1);
    }
}
exports.exceptionHandler = new ExceptionHandler();

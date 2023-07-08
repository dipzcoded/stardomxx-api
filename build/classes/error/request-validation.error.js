"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const v1_1 = require("../../enums/v1");
const error_1 = require("../../classes/abstract/error");
class RequestValidationError extends error_1.CustomError {
    constructor(errors) {
        super("Invalid Request parameters");
        this.errors = errors;
        this.isOperational = true;
        this.statusCode = v1_1.ResponseStatusCodeEnum.BAD;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        const formatErrors = this.errors.map((el) => {
            return {
                message: el.msg,
                path: el.type,
            };
        });
        return {
            status: v1_1.ResponseStatusSignalEnum.FAILED,
            errors: formatErrors,
        };
    }
}
exports.RequestValidationError = RequestValidationError;

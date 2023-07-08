"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestError = void 0;
const v1_1 = require("../../enums/v1");
const error_1 = require("../../classes/abstract/error");
class InvalidRequestError extends error_1.CustomError {
    constructor(reason) {
        super("Bad Request");
        this.reason = reason;
        this.isOperational = true;
        this.statusCode = v1_1.ResponseStatusCodeEnum.INVALID;
        Object.setPrototypeOf(this, InvalidRequestError.prototype);
    }
    serializeErrors() {
        return {
            status: v1_1.ResponseStatusSignalEnum.FAILED,
            errors: [
                {
                    message: this.reason,
                },
            ],
        };
    }
}
exports.InvalidRequestError = InvalidRequestError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const v1_1 = require("../../enums/v1");
const error_1 = require("../../classes/abstract/error");
class NotFoundError extends error_1.CustomError {
    constructor(reason) {
        super("NotFound Request");
        this.reason = reason;
        this.isOperational = true;
        this.statusCode = v1_1.ResponseStatusCodeEnum.NOT_FOUND;
        Object.setPrototypeOf(this, NotFoundError.prototype);
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
exports.NotFoundError = NotFoundError;

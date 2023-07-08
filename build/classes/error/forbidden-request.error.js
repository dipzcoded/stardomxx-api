"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const v1_1 = require("../../enums/v1");
const error_1 = require("../../classes/abstract/error");
class ForbiddenError extends error_1.CustomError {
    constructor(reason) {
        super("Forbidden Request");
        this.reason = reason;
        this.isOperational = true;
        this.statusCode = v1_1.ResponseStatusCodeEnum.FORBIDDEN;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
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
exports.ForbiddenError = ForbiddenError;

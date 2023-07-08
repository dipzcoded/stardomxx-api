"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidationMiddleware = void 0;
const request_validation_middleware_validator_1 = __importDefault(require("./request-validation.middleware.validator"));
exports.requestValidationMiddleware = request_validation_middleware_validator_1.default;

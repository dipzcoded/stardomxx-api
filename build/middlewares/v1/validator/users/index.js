"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.registrationValidator = exports.loginValidator = exports.forgotPasswordValidator = exports.accountActivationValidator = void 0;
const account_activation_validator_1 = __importDefault(require("./account-activation.validator"));
exports.accountActivationValidator = account_activation_validator_1.default;
const forgot_password_validator_1 = __importDefault(require("./forgot-password.validator"));
exports.forgotPasswordValidator = forgot_password_validator_1.default;
const login_validator_1 = __importDefault(require("./login.validator"));
exports.loginValidator = login_validator_1.default;
const registration_validator_1 = __importDefault(require("./registration.validator"));
exports.registrationValidator = registration_validator_1.default;
const reset_password_validator_1 = __importDefault(require("./reset-password.validator"));
exports.resetPasswordValidator = reset_password_validator_1.default;

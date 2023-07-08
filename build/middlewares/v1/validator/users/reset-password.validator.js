"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = [
    (0, express_validator_1.body)("resetToken")
        .isString()
        .withMessage("resetToken must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("resetToken is required"),
    (0, express_validator_1.body)("newPassword")
        .isString()
        .withMessage("newPassword must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("newPassword is required"),
];

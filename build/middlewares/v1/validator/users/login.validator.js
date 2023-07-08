"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = [
    (0, express_validator_1.body)("email")
        .isString()
        .withMessage("email must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("must be a valid email address format"),
    (0, express_validator_1.body)("password")
        .isString()
        .withMessage("password must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("password is required"),
];

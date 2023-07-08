"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = [
    (0, express_validator_1.body)("firstName")
        .isString()
        .withMessage("firstName must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("firstName is required"),
    (0, express_validator_1.body)("lastName")
        .isString()
        .withMessage("lastName must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("lastName is required"),
    (0, express_validator_1.body)("country")
        .isString()
        .withMessage("country must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("country is required"),
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
    (0, express_validator_1.body)("phoneNumber")
        .isString()
        .withMessage("phoneNumber must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("phoneNumber is required"),
];

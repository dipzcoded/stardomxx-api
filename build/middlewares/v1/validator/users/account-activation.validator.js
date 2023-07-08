"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = [
    (0, express_validator_1.query)("token")
        .isString()
        .withMessage("token must be a string")
        .trim()
        .not()
        .isEmpty()
        .withMessage("token is required"),
];

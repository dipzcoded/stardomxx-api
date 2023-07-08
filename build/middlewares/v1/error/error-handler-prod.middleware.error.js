"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../classes/error");
exports.default = (err, req, res, next) => {
    error_1.exceptionHandler.handleError(err, res);
};

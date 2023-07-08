"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRoute = void 0;
const error_1 = require("../../../classes/error");
const notFoundRoute = (req, res, next) => {
    next(new error_1.NotFoundError(`Route not found - ${req.originalUrl} `));
};
exports.notFoundRoute = notFoundRoute;

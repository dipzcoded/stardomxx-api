"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRoute = exports.errorHandlerDevMiddlewareDev = exports.errorHandlerMiddlewareProd = void 0;
const error_handler_prod_middleware_error_1 = __importDefault(require("./error-handler-prod.middleware.error"));
exports.errorHandlerMiddlewareProd = error_handler_prod_middleware_error_1.default;
const error_handler_dev_middleware_error_1 = __importDefault(require("./error-handler-dev.middleware.error"));
exports.errorHandlerDevMiddlewareDev = error_handler_dev_middleware_error_1.default;
const not_found_route_error_1 = require("./not-found-route.error");
Object.defineProperty(exports, "notFoundRoute", { enumerable: true, get: function () { return not_found_route_error_1.notFoundRoute; } });

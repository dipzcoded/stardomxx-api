"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictUsersFromResourceMiddleware = exports.requiresAuthMiddleware = void 0;
const requires_auth_middleware_auth_1 = __importDefault(require("./requires-auth.middleware.auth"));
exports.requiresAuthMiddleware = requires_auth_middleware_auth_1.default;
const restrict_user_access_middleware_auth_1 = __importDefault(require("./restrict-user-access.middleware.auth"));
exports.restrictUsersFromResourceMiddleware = restrict_user_access_middleware_auth_1.default;

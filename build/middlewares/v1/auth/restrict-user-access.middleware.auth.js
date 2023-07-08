"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../classes/error");
exports.default = (userRoles) => {
    return (req, res, next) => {
        if (!userRoles.includes(req.user.role)) {
            throw new error_1.ForbiddenError("Forbidden Resource Access");
        }
        next();
    };
};

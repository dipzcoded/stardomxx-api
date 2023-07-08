"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const error_1 = require("../../../classes/error");
exports.default = (req, res, next) => {
    var _a;
    let token;
    if (req.headers["authorization"] &&
        ((_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer"))) {
        token = req.headers["authorization"].split(" ")[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                next(new error_1.InvalidRequestError("Authorization is Invalid"));
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                next(new error_1.InvalidRequestError("Authorization is Invalid"));
            }
            if (error instanceof jsonwebtoken_1.NotBeforeError) {
                next(new error_1.InvalidRequestError("Authorization is Invalid"));
            }
        }
    }
    else {
        next(new error_1.ForbiddenError("No Bearer token passed!"));
    }
};

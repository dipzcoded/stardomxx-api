"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPasswordResetTokenExpiresDate = exports.hashToken = exports.setToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const setToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
exports.setToken = setToken;
const hashToken = (token) => {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
};
exports.hashToken = hashToken;
const setPasswordResetTokenExpiresDate = () => {
    return Date.now() + 15 * 60 * 1000;
};
exports.setPasswordResetTokenExpiresDate = setPasswordResetTokenExpiresDate;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareUserPassword = exports.hashUserPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const hashUserPassword = (password) => {
    return argon2_1.default.hash(password);
};
exports.hashUserPassword = hashUserPassword;
const compareUserPassword = (loginPassword, user) => {
    return argon2_1.default.verify(user.password, loginPassword);
};
exports.compareUserPassword = compareUserPassword;

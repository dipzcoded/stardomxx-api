"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.prismaClient = void 0;
const prisma_client_util_1 = __importDefault(require("./prisma-client.util"));
exports.prismaClient = prisma_client_util_1.default;
const router_util_1 = __importDefault(require("./router.util"));
exports.router = router_util_1.default;

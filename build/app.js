"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const v1_1 = require("./routes/v1");
const error_1 = require("./middlewares/v1/error");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({
    limit: "20mb",
}));
app.use(express_1.default.urlencoded({
    limit: "20mb",
}));
app.get("/", (req, res, next) => {
    return res.json({
        message: "welcome to stardomx api",
    });
});
app.use("/api/users", v1_1.userRoute);
app.use(error_1.notFoundRoute);
app.use(error_1.errorHandlerDevMiddlewareDev);

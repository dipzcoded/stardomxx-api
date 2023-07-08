"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../classes/abstract/error");
const v1_1 = require("../../../enums/v1");
exports.default = (err, req, res, next) => {
    if (err instanceof error_1.CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors());
    }
    // console.error(err);
    res.status(v1_1.ResponseStatusCodeEnum.BAD).json({
        status: "failed",
        errors: [
            {
                message: err.message,
            },
        ],
    });
};

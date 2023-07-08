"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatusCodeEnum = void 0;
var ResponseStatusCodeEnum;
(function (ResponseStatusCodeEnum) {
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["BAD"] = 400] = "BAD";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["INVALID"] = 401] = "INVALID";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["OK"] = 200] = "OK";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["CREATED"] = 201] = "CREATED";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["DELETED"] = 204] = "DELETED";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseStatusCodeEnum[ResponseStatusCodeEnum["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(ResponseStatusCodeEnum = exports.ResponseStatusCodeEnum || (exports.ResponseStatusCodeEnum = {}));

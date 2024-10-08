"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const jwtAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next((0, http_errors_1.default)(401, "Token not found"));
    }
    try {
        const token = authorization.split(" ")[1];
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.config.jwtKey);
        const _req = req;
        _req.userId = decoded.sub;
        console.log(decoded);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return next((0, http_errors_1.default)(401, "Expired token"));
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return next((0, http_errors_1.default)(401, "Invalid token"));
        }
        else {
            return next((0, http_errors_1.default)(401, "Token verification failed"));
        }
    }
};
exports.default = jwtAuth;

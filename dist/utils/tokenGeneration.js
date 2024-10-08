"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateToken = (user) => {
    const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtKey, { expiresIn: '1h' });
};
exports.generateToken = generateToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsers = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../Models/User"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
async function hashingPassword(password) {
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    return hashedPassword;
}
const register = async function (req, res, next) {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            const error = (0, http_errors_1.default)(400, "All fields are required");
            return next(error);
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            const error = (0, http_errors_1.default)(400, 'User already exists with this e-mail');
            console.error("User already exists with this e-mail");
            return next(error);
        }
        if (password !== confirmPassword) {
            return next((0, http_errors_1.default)(400, "password and confirm password do not match"));
        }
        const hashedPassword = await hashingPassword(password);
        const newUser = new User_1.default({ name, email, password: hashedPassword });
        const response = await newUser.save();
        console.log("User created");
        const jwtToken = (0, jsonwebtoken_1.sign)({ sub: newUser._id }, config_1.config.jwtKey, { expiresIn: "21d" });
        return res.status(201).json({ accessToken: jwtToken, user: response });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, 'Server Error'));
    }
};
exports.register = register;
const login = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = (0, http_errors_1.default)(400, "All fields are required");
            return next(error);
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            console.error("User not found");
            const error = (0, http_errors_1.default)(404, "User not found");
            return next(error);
        }
        const matchPassword = await bcrypt_1.default.compare(password, user.password);
        if (!matchPassword) {
            console.error("E-mail or Password incorrect");
            const error = (0, http_errors_1.default)(400, "E-mail or Password incorrect");
            return next(error);
        }
        const jwtToken = (0, jsonwebtoken_1.sign)({ sub: user._id }, config_1.config.jwtKey, { expiresIn: "21d" });
        res.cookie("token", jwtToken, {
            httpOnly: true,
            sameSite: "lax",
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });
        return res.status(201).json({ accessToken: jwtToken });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, 'Server Error'));
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    res.clearCookie("token", { path: '/' });
    return res.json({ message: "Logged Out" });
};
exports.logout = logout;
const fetchUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const Users = await User_1.default.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const totalUsers = await User_1.default.find();
        const TotalUsers = totalUsers.length;
        return res.json({
            Users,
            TotalUsers,
            totalPages: Math.ceil(TotalUsers / limit),
            currentPage: page
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server Issue"));
    }
};
exports.fetchUsers = fetchUsers;

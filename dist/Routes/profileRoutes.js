"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const checkAuth = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    }
    else {
        next();
    }
};
exports.checkAuth = checkAuth;
router.get('/', checkAuth, (req, res) => {
    const user = req.user;
    res.render('profile', { user });
});
exports.default = router;

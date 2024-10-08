"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
const router = express_1.default.Router();
router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect("/profile");
    }
    res.render("login");
});
router.get('/logout', async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));
router.get('/google/redirect', passport_1.default.authenticate('google'), (req, res) => {
    const user = req.user;
    const jwtToken = (0, jsonwebtoken_1.sign)({ sub: user._id }, config_1.config.jwtKey, { expiresIn: "3d" });
    res.cookie('jwt', jwtToken, { httpOnly: true });
    res.redirect('/profile');
    console.log(jwtToken);
});
exports.default = router;

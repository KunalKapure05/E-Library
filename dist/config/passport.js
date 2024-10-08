"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const User_1 = __importDefault(require("../Models/User"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: config_1.config.GoogleClientId,
    clientSecret: config_1.config.GoogleClientSecret,
    callbackURL: "/auth/google/redirect",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User_1.default.findOne({ googleid: profile.id });
        if (!user) {
            const newUser = await User_1.default.findOneAndUpdate({
                googleId: profile.id,
            }, {
                $setOnInsert: {
                    name: profile.displayName,
                    email: profile.emails?.[0].value, // we are using optional chaining because profile.emails may be undefined.
                }
            }, {
                upsert: true,
                new: true,
            });
            if (newUser) {
                done(null, newUser);
            }
        }
        else {
            done(null, user);
        }
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await User_1.default.findById(id);
    done(null, user);
});

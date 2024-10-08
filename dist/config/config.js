"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_URL,
    env: process.env.NODE_ENV,
    jwtKey: process.env.JWT_KEY,
    cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    GoogleClientId: process.env.GOOGLE_CLIENT_ID,
    GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    secretKey: process.env.SECRET_KEY
};
//Obj freeze is used for not changing and will give only read access to the config 
exports.config = Object.freeze(_config);

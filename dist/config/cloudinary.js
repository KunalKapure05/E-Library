"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("../config/config");
cloudinary_1.v2.config({
    cloud_name: config_1.config.cloudinaryCloud,
    api_key: config_1.config.cloudinaryApiKey,
    api_secret: config_1.config.cloudinaryApiSecret
});
exports.default = cloudinary_1.v2;

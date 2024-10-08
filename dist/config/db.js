"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectDb = async () => {
    try {
        const db = mongoose_1.default.connection;
        db.on('connected', () => {
            console.log("Connected to db Successfully");
        });
        db.on('error', (err) => {
            console.log("Error in connecting to db", err);
        });
        await mongoose_1.default.connect(config_1.config.databaseUrl);
    }
    catch (err) {
        console.error("Failed to connect", err);
        process.exit(1);
    }
};
exports.default = connectDb;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const errorhandler_1 = __importDefault(require("./middlewares/errorhandler"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const bookRoutes_1 = __importDefault(require("./Routes/bookRoutes"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./Routes/profileRoutes"));
require("./config/passport");
const config_1 = require("./config/config");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use((0, express_session_1.default)({
    secret: config_1.config.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
//  app.get('/', (req, res) => {
//   res.send("welcome to the E-libary System")
//  })
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", (req, res) => {
    res.render("home", { user: req.user });
});
app.use('/auth', authRoutes_1.default);
app.use("/profile", profileRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/books', bookRoutes_1.default);
app.use(errorhandler_1.default);
exports.default = app;

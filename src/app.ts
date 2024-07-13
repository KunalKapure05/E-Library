import express from "express";
import path from "path";

import errorHandler from "./middlewares/errorhandler";
import userRoute from './Routes/userRoutes' 
import bookRoutes from "./Routes/bookRoutes";
import authRoutes from "./Routes/authRoutes" ;
import profileRoutes,{checkAuth} from "./Routes/profileRoutes";
import "./config/passport";
import {config} from "./config/config";
import passport from "passport";
import expressSession from "express-session";








const app = express();

app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressSession({
    secret: config.secretKey as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
 }));
 

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
    res.render("home",{ user: req.user });
  });

app.use('/auth',authRoutes);
app.use("/profile", profileRoutes);

app.use('/api/users',userRoute);
app.use('/api/books',bookRoutes)





app.use(errorHandler)

export default app;

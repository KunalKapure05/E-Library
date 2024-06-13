import express from "express";

import errorHandler from "./middlewares/errorhandler";
import userRoute from './Routes/userRoutes' 
const app = express();

app.use(express.json())

app.use('/api/users',userRoute);




app.use(errorHandler)

export default app;

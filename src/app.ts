import express from "express";

import errorHandler from "./middlewares/errorhandler";
import userRoute from './Routes/userRoutes' 
import bookRoutes from "./Routes/bookRoutes";
const app = express();

app.use(express.json())

app.use('/api/users',userRoute);
app.use('/api/books',bookRoutes)




app.use(errorHandler)

export default app;

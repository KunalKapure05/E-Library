import express from "express";

import errorHandler from "./middlewares/errorhandler";

const app = express();

app.use(express.json())

app.get("/", (req, res,next) => {
  res.json({ message: "Heyyyyyyy" });
});


app.use(errorHandler)

export default app;

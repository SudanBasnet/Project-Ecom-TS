import express, { NextFunction, Request, Response } from "express";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import routes from "./routes/index";
import appError from "./utils/appError.utils";
import { notFound } from "./middlewares/notFound.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

//!creating express app instance
const app = express();

//!using cors
app.use(
  cors({
    origin: "*",
  }),
);
//!body parser
app.use(express.json({ limit: "10mb" }));

//!using middlewares
//*cookieparser
app.use(cookieParser());

//!health route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "server is up and running",
    success: true,
    status: "success",
  });
});

//!using routes
app.use("/api/v1", routes);

//!path not found error middleware
app.use(notFound);

//!error handler
app.use(errorHandler);

export default app;

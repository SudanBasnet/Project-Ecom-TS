import express, { Request, Response } from "express";
import userRoutes from "./routes/user.routes";

//!creating express app instance
const app = express();

//!body parser
app.use(express.json({ limit: "10mb" }));

//!using middlewares

//!health route
app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "server is up and running",
    success: true,
    status: "success",
  });
});

//!using routes
app.use("/api/v1/users", userRoutes);

//!error handler

export default app;

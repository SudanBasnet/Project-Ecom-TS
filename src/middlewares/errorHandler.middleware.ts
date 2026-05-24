import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import ENV_CONFIG from "../config/env.config";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let message = "Internal server error";
  let statusCode = error?.statusCode || 500;
  let status = error?.status || "error";

  //! custom error
  if (error instanceof AppError) {
    message = error.message;
  }

  //! validation error
  if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((err: any) => err.message)
      .join(",");
    statusCode = 422;
    status = "fail";
  }

  //! mongoose error
  if (error.name === "MongooseError") {
    message = error.message;
    statusCode = 400;
    status = "fail";
  }

  //! jwt errors
  //* error response
  res.status(statusCode).json({
    message,
    status,
    success: false,
    data: null,
    stack: ENV_CONFIG.node_env === "development" ? error.stack : null,
  });
};

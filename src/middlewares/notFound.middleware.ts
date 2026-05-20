//middlewares/notFound.middleware.ts

import { NextFunction, Request, Response } from "express";
import appError from "../utils/appError.utils";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Can not ${req.method} on ${req.originalUrl}`;

  next(new appError(message, 404));
};

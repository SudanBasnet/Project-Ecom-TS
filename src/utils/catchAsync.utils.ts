import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //promise.resolve(fn(req,res,next)).catch((error)=> next(error))
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

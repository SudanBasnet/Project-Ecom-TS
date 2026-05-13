//*crud user

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
//!get all users
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter = {};
    //* get all users query
    const users = await User.find(filter);
    //* success response
    res.status(200).json({
      message: "All users Fetched",
      data: users,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: "error",
      success: "false",
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

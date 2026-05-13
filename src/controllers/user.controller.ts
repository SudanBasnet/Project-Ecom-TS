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

//!get by id
export const getbyid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    //* get all users query
    const user = await User.findOne({ _id: id });

    //* user not found error
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      throw error;
    }
    //* success response
    res.status(200).json({
      message: `user ${id} Fetched`,
      data: user,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: error?.status || "error",
      success: "false",
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

//!del by id
//! delete by id
export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    //* find user
    const user = await User.findOne({ _id: id });

    //* user not found
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.status = "fail";
      throw error;
    }

    //* delete user
    await user.deleteOne();

    //* success response
    res.status(200).json({
      message: `User ${id} deleted`,
      data: user,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: error?.status || "error",
      success: false,
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

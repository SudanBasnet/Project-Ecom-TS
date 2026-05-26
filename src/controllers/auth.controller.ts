import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { comparepassword, hashPassword } from "../utils/bcrypt.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/cloudinary.utils";
import ENV_CONFIG from "../config/env.config";

const folder = "/profile_image";

//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;

  const image = req.file as Express.Multer.File;
  console.log(image);

  if (!full_name) {
    throw new AppError("full name is required", 400);
  }
  if (!email) {
    throw new AppError("email is required", 400);
  }
  if (!password) {
    throw new AppError("password is required", 400);
  }

  //* create User instance
  const user = new User({ full_name, email, phone });

  //! hash password
  const hash = await hashPassword(password);
  user.password = hash;

  //! hanlde profile image
  if (image) {
    const { path, public_id } = await sendFileToCloudinary(image, folder);
    user.profile_image = {
      path,
      public_id,
    };
  }

  //* save user
  await user.save();

  //* success response
  sendResponse(res, {
    message: "Account created",
    data: user,
    statusCode: 201,
  });
});

//! login
export const login = catchAsync(async (req: Request, res: Response) => {
  //* login
  //* email password <- req.body
  const { email, password } = req.body;

  if (!email) {
    throw new AppError("email is required", 400);
  }
  if (!password) {
    throw new AppError("password is required", 400);
  }
  //* find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError("email or password does not matched", 400);
  }
  //*  compare password
  // const isPasswordMatched = password === user.password;
  const isPasswordMatched = await comparepassword(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("email or password does not matched", 400);
  }

  //todo: generate access token -> jwt
  const payload = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
  const access_token = generateJwtToken(payload);
  //* send access  token in cookie

  res.cookie("access_token", access_token, {
    httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
    maxAge: parseInt(ENV_CONFIG.cookie_exp ?? "7") * 24 * 60 * 1000,
    secure: ENV_CONFIG.node_env === "development" ? false : true,
    sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
  });
  //* success response
  sendResponse(res, {
    message: "Login success",
    data: {
      user,
      access_token,
    },
    statusCode: 201,
  });
});

//! update profile
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // try logic
  },
);

export const changeProfilePicture = catchAsync(
  async (req: Request, res: Response) => {
    //
    const image = req.file as Express.Multer.File;
    const id = req.user?._id;

    if (!image) {
      throw new AppError("profile image required", 400);
    }

    //! find user
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new AppError("user account not found", 400);
    }

    //! upload image to cloud
    const { path, public_id } = await sendFileToCloudinary(image, folder);

    //! delete old image
    if (user?.profile_image?.public_id) {
      await deleteFileFromCloudinary(user.profile_image.public_id);
    }

    //! assign new image to user
    user.profile_image = {
      path,
      public_id,
    };

    //! save user
    await user.save();

    //! send success response
    sendResponse(res, {
      message: "profile image updated",
      data: user,
      statusCode: 200,
    });
  },
);

//! get profile

//! change password

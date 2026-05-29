"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfilePicture = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmail_utils_1 = require("../utils/sendEmail.utils");
const email_utils_1 = require("../utils/email.utils");
const folder = "/profile_image";
//! register
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { full_name, email, password, phone } = req.body;
    const image = req.file;
    console.log(image);
    if (!full_name) {
        throw new appError_utils_1.default("full name is required", 400);
    }
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
    }
    if (!password) {
        throw new appError_utils_1.default("password is required", 400);
    }
    //* create User instance
    const user = new user_model_1.default({ full_name, email, phone });
    //! hash password
    const hash = await (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hash;
    //! hanlde profile image
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        user.profile_image = {
            path,
            public_id,
        };
    }
    //* save user
    await user.save();
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account created",
        data: user,
        statusCode: 201,
    });
});
//! login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //* login
    //* email password <- req.body
    const { email, password } = req.body;
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
    }
    if (!password) {
        throw new appError_utils_1.default("password is required", 400);
    }
    //* find user by email
    const user = await user_model_1.default.findOne({ email: email });
    if (!user) {
        throw new appError_utils_1.default("email or password does not matched", 400);
    }
    //*  compare password
    // const isPasswordMatched = password === user.password;
    const isPasswordMatched = await (0, bcrypt_utils_1.comparepassword)(password, user.password);
    if (!isPasswordMatched) {
        throw new appError_utils_1.default("email or password does not matched", 400);
    }
    //todo: generate access token -> jwt
    const payload = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: `Welcome ${user.full_name}`,
        html: (0, email_utils_1.generateLoginSuccessEmailHtml)(req, {
            full_name: user.full_name,
            _id: user._id,
            email: user.email,
        }),
    });
    //* send access  token in cookie
    res.cookie("access_token", access_token, {
        httpOnly: env_config_1.default.node_env === "development" ? false : true,
        maxAge: parseInt(env_config_1.default.cookie_exp ?? "7") * 24 * 60 * 1000,
        secure: env_config_1.default.node_env === "development" ? false : true,
        sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
    });
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login success",
        data: {
            user,
            access_token,
        },
        statusCode: 201,
    });
});
//! update profile
const update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    // try logic
});
exports.changeProfilePicture = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //
    const image = req.file;
    const id = req.user?._id;
    if (!image) {
        throw new appError_utils_1.default("profile image required", 400);
    }
    //! find user
    const user = await user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new appError_utils_1.default("user account not found", 400);
    }
    //! upload image to cloud
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    //! delete old image
    if (user?.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile_image.public_id);
    }
    //! assign new image to user
    user.profile_image = {
        path,
        public_id,
    };
    //! save user
    await user.save();
    //! send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "profile image updated",
        data: user,
        statusCode: 200,
    });
});
//! get profile
//! change password

"use strict";
//*crud user
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.getbyid = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
//!get all users
const getAll = async (req, res, next) => {
    try {
        const filter = {};
        //* get all users query
        const users = await user_model_1.default.find(filter);
        //* success response
        res.status(200).json({
            message: "All users Fetched",
            data: users,
            success: true,
            status: "success",
        });
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: "error",
            success: "false",
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.getAll = getAll;
//!get by id
const getbyid = async (req, res, next) => {
    try {
        const { id } = req.params;
        //* get all users query
        const user = await user_model_1.default.findOne({ _id: id });
        //* user not found error
        if (!user) {
            const error = new Error("User not found");
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
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: "false",
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.getbyid = getbyid;
//!del by id
//! delete by id
const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        //* find user
        const user = await user_model_1.default.findOne({ _id: id });
        //* user not found
        if (!user) {
            const error = new Error("User not found");
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
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.deleteById = deleteById;

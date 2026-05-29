"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCloudinary = exports.sendFileToCloudinary = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
const sendFileToCloudinary = async (file, folder = "/") => {
    try {
        const upload_folder = "Ecom-users" + folder;
        const { public_id, secure_url } = await cloudinary_config_1.default.uploader.upload(file.path, {
            folder: upload_folder,
            transformation: [
                {
                    width: 800,
                    crop: "scale",
                    fetch_format: "auto",
                    quality: "auto",
                },
            ],
        });
        //delete image fron server uploads folder
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        return {
            public_id,
            path: secure_url,
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.sendFileToCloudinary = sendFileToCloudinary;
//! delete file from cloudinary
const deleteFileFromCloudinary = async (public_id) => {
    try {
        await cloudinary_config_1.default.uploader.destroy(public_id);
        return true;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;

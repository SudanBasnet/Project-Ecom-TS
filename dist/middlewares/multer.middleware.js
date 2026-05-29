"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const multerUploader = () => {
    //!upload folder
    const uploadFolder = path_1.default.join(process.cwd(), "uploads");
    const fileSize = 10 * 1024 * 1024;
    if (!fs_1.default.existsSync(uploadFolder)) {
        fs_1.default.mkdirSync(uploadFolder, { recursive: true });
    }
    //!multer storage
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "");
            cb(null, uniqueName);
        },
    });
    //!file filter
    const fileFilter = (req, file, cb) => {
        const allowedExtentios = /png|jpg|jpeg|webp/;
        const allowedMimeType = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/webp",
            "application/pdf",
        ];
        const extName = allowedExtentios.test(path_1.default.extname(file.originalname).toLocaleLowerCase());
        const isAllowedMimeType = allowedMimeType.includes(file.mimetype);
        if (extName && isAllowedMimeType) {
            cb(null, true);
        }
        else {
            const error = new appError_utils_1.default(`only image (png ,jpg ,jpeg and webp) and pdf are allowed`, 400);
            cb(error);
        }
    };
    //!multer upload api
    const upload = (0, multer_1.default)({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: fileSize,
        },
    });
    return upload;
};
exports.multerUploader = multerUploader;

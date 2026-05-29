"use strict";
//middlewares/notFound.middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const notFound = (req, res, next) => {
    const message = `Can not ${req.method} on ${req.originalUrl}`;
    next(new appError_utils_1.default(message, 404));
};
exports.notFound = notFound;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const article_model_1 = __importDefault(require("../models/article.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (_req, res) => {
    const articles = await article_model_1.default.find().sort({ featured: -1, createdAt: -1 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "articles fetched",
        data: articles,
        statusCode: 200,
    });
});

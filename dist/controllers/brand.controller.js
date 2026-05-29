"use strict";
//controllers/brand.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
//!create brand
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { name, description } = req.body;
    if (!name) {
        throw new appError_utils_1.default("Brand name is required", 400);
    }
    const brand = await brand_model_1.default.create({
        name,
        description,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand created",
        data: brand,
        statusCode: 201,
    });
});
//!get all brands
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const brands = await brand_model_1.default.find();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brands fetched",
        data: brands,
        statusCode: 200,
    });
});
//!get brand by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default(`Brand ${id} not found`, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Brand ${id} fetched`,
        data: brand,
        statusCode: 200,
    });
});
//!update brand
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    //! update only provided fields
    if (name) {
        brand.name = name;
    }
    if (description) {
        brand.description = description;
    }
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand updated",
        data: brand,
        statusCode: 200,
    });
});
//!delete brand
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    await brand.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand deleted",
        data: null,
        statusCode: 200,
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewProducts = exports.getFeaturedProducts = exports.getByCategory = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
//* get all products
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const filter = {};
    const products = await product_model_1.default.find(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched",
        statusCode: 200,
        data: products,
    });
});
//* get product by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        throw new appError_utils_1.default(`Product ${id} not found`, 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product ${id} fetched`,
        statusCode: 200,
        data: product,
    });
});
//* create product
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const product = await product_model_1.default.create(req.body);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product created",
        statusCode: 201,
        data: product,
    });
});
//* update product
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        throw new appError_utils_1.default(`Product ${id} not found`, 404);
    }
    const updatedProduct = await product_model_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product updated",
        statusCode: 200,
        data: updatedProduct,
    });
});
//* delete product
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findById(id);
    if (!product) {
        throw new appError_utils_1.default(`Product ${id} not found`, 404);
    }
    await product_model_1.default.findByIdAndDelete(id);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product deleted",
        statusCode: 200,
        data: null,
    });
});
//* get by category
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id: categoryId } = req.params;
    const products = await product_model_1.default.find({ category: categoryId });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Products by category ${categoryId} fetched`,
        statusCode: 200,
        data: products,
    });
});
//* get all featured products
exports.getFeaturedProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ featured: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All featured products fetched",
        statusCode: 200,
        data: products,
    });
});
//* get all new arrivals
exports.getNewProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_model_1.default.find({ new_arrival: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All new arrival products fetched",
        statusCode: 200,
        data: products,
    });
});

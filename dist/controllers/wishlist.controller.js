"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearWishlist = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const wish_model_1 = __importDefault(require("../models/wish.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const getProductId = (req) => req.params.productId || req.params.id || req.body.product;
//! get logged in user's wishlist
exports.getWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    let wishlist = await wish_model_1.default.findOne({ user: userId }).populate("products");
    if (!wishlist) {
        wishlist = await wish_model_1.default.create({
            user: userId,
            products: [],
        });
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "wishlist fetched",
        statusCode: 200,
        data: wishlist,
    });
});
//! add product to wishlist
exports.addToWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    if (!productId) {
        throw new appError_utils_1.default("product is required", 400);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new appError_utils_1.default("invalid product id", 400);
    }
    const product = await product_model_1.default.findOne({ _id: productId });
    if (!product) {
        throw new appError_utils_1.default(`product ${productId} not found`, 404);
    }
    const wishlist = await wish_model_1.default.findOneAndUpdate({ user: userId }, {
        $setOnInsert: { user: userId },
        $addToSet: { products: product._id },
    }, {
        new: true,
        upsert: true,
    }).populate("products");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product added to wishlist",
        statusCode: 200,
        data: wishlist,
    });
});
//! remove product from wishlist
exports.removeFromWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    if (!productId) {
        throw new appError_utils_1.default("product is required", 400);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new appError_utils_1.default("invalid product id", 400);
    }
    const wishlist = await wish_model_1.default.findOneAndUpdate({ user: userId }, { $pull: { products: productId } }, { new: true }).populate("products");
    if (!wishlist) {
        throw new appError_utils_1.default("wishlist not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product removed from wishlist",
        statusCode: 200,
        data: wishlist,
    });
});
//! clear wishlist
exports.clearWishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await wish_model_1.default.findOneAndUpdate({ user: userId }, { products: [] }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    }).populate("products");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "wishlist cleared",
        statusCode: 200,
        data: wishlist,
    });
});

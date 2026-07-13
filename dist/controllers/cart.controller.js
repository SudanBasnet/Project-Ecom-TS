"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const getProductId = (req) => req.params.productId || req.params.id || req.body.product;
const getQuantity = (req, defaultValue = 1) => {
    const quantity = Number(req.body.quantity ?? defaultValue);
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new appError_utils_1.default("quantity must be a positive integer", 400);
    }
    return quantity;
};
const getOrCreateCart = async (userId) => {
    let cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        cart = await cart_model_1.default.create({
            user: userId,
            items: [],
        });
    }
    const productIds = cart.items.map((item) => item.product);
    const existingProducts = await product_model_1.default.find({
        _id: { $in: productIds },
    })
        .select("_id")
        .lean();
    const existingProductIds = new Set(existingProducts.map((product) => product._id.toString()));
    const validItems = cart.items.filter((item) => existingProductIds.has(item.product.toString()));
    if (validItems.length !== cart.items.length) {
        cart.set("items", validItems);
        await cart.save();
    }
    return cart;
};
//! get logged in user's cart
exports.getCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const cart = await getOrCreateCart(userId);
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "cart fetched",
        statusCode: 200,
        data: cart,
    });
});
//! add product to cart
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    const quantity = getQuantity(req);
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
    if (product.stock < quantity) {
        throw new appError_utils_1.default("requested quantity exceeds available stock", 400);
    }
    const cart = await getOrCreateCart(userId);
    const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);
    if (item) {
        const updatedQuantity = item.quantity + quantity;
        if (updatedQuantity > product.stock) {
            throw new appError_utils_1.default("requested quantity exceeds available stock", 400);
        }
        item.quantity = updatedQuantity;
    }
    else {
        cart.items.push({
            product: product._id,
            quantity,
        });
    }
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product added to cart",
        statusCode: 200,
        data: cart,
    });
});
//! update product quantity in cart
exports.updateCartItem = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    const quantity = getQuantity(req);
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
    if (quantity > product.stock) {
        throw new appError_utils_1.default("requested quantity exceeds available stock", 400);
    }
    const cart = await getOrCreateCart(userId);
    const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);
    if (!item) {
        throw new appError_utils_1.default("product not found in cart", 404);
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "cart item updated",
        statusCode: 200,
        data: cart,
    });
});
//! remove product from cart
exports.removeFromCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    if (!productId) {
        throw new appError_utils_1.default("product is required", 400);
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new appError_utils_1.default("invalid product id", 400);
    }
    const cart = await getOrCreateCart(userId);
    cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product removed from cart",
        statusCode: 200,
        data: cart,
    });
});
//! clear cart
exports.clearCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    const cart = await getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    await cart.populate("items.product");
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "cart cleared",
        statusCode: 200,
        data: cart,
    });
});

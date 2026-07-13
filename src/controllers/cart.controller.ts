import { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

const getProductId = (req: Request) =>
  req.params.productId || req.params.id || req.body.product;

const getQuantity = (req: Request, defaultValue = 1) => {
  const quantity = Number(req.body.quantity ?? defaultValue);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError("quantity must be a positive integer", 400);
  }

  return quantity;
};

const getOrCreateCart = async (userId: string | mongoose.Types.ObjectId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const productIds = cart.items.map((item: any) => item.product);
  const existingProducts = await Product.find({
    _id: { $in: productIds },
  })
    .select("_id")
    .lean();
  const existingProductIds = new Set(
    existingProducts.map((product) => product._id.toString()),
  );
  const validItems = cart.items.filter((item: any) =>
    existingProductIds.has(item.product.toString()),
  );

  if (validItems.length !== cart.items.length) {
    cart.set("items", validItems);
    await cart.save();
  }

  return cart as any;
};

//! get logged in user's cart
export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const cart = await getOrCreateCart(userId);

  await cart.populate("items.product");

  sendResponse(res, {
    message: "cart fetched",
    statusCode: 200,
    data: cart,
  });
});

//! add product to cart
export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const productId = getProductId(req);
  const quantity = getQuantity(req);

  if (!productId) {
    throw new AppError("product is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("invalid product id", 400);
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new AppError(`product ${productId} not found`, 404);
  }

  if (product.stock < quantity) {
    throw new AppError("requested quantity exceeds available stock", 400);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find(
    (cartItem: any) => cartItem.product.toString() === productId,
  );

  if (item) {
    const updatedQuantity = item.quantity + quantity;

    if (updatedQuantity > product.stock) {
      throw new AppError("requested quantity exceeds available stock", 400);
    }

    item.quantity = updatedQuantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
    });
  }

  await cart.save();
  await cart.populate("items.product");

  sendResponse(res, {
    message: "product added to cart",
    statusCode: 200,
    data: cart,
  });
});

//! update product quantity in cart
export const updateCartItem = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const productId = getProductId(req);
    const quantity = getQuantity(req);

    if (!productId) {
      throw new AppError("product is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("invalid product id", 400);
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new AppError(`product ${productId} not found`, 404);
    }

    if (quantity > product.stock) {
      throw new AppError("requested quantity exceeds available stock", 400);
    }

    const cart = await getOrCreateCart(userId);
    const item = cart.items.find(
      (cartItem: any) => cartItem.product.toString() === productId,
    );

    if (!item) {
      throw new AppError("product not found in cart", 404);
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    sendResponse(res, {
      message: "cart item updated",
      statusCode: 200,
      data: cart,
    });
  },
);

//! remove product from cart
export const removeFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const productId = getProductId(req);

    if (!productId) {
      throw new AppError("product is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("invalid product id", 400);
    }

    const cart = await getOrCreateCart(userId);
    cart.items = cart.items.filter(
      (cartItem: any) => cartItem.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("items.product");

    sendResponse(res, {
      message: "product removed from cart",
      statusCode: 200,
      data: cart,
    });
  },
);

//! clear cart
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const cart = await getOrCreateCart(userId);

  cart.items = [];

  await cart.save();
  await cart.populate("items.product");

  sendResponse(res, {
    message: "cart cleared",
    statusCode: 200,
    data: cart,
  });
});

import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/product.model";
import Wishlist from "../models/wish.model";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

const getProductId = (req: Request) =>
  req.params.productId || req.params.id || req.body.product;

//! get logged in user's wishlist
export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;

  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  sendResponse(res, {
    message: "wishlist fetched",
    statusCode: 200,
    data: wishlist,
  });
});

//! add product to wishlist
export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const productId = getProductId(req);

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

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    {
      $setOnInsert: { user: userId },
      $addToSet: { products: product._id },
    },
    {
      new: true,
      upsert: true,
    },
  ).populate("products");

  sendResponse(res, {
    message: "product added to wishlist",
    statusCode: 200,
    data: wishlist,
  });
});

//! remove product from wishlist
export const removeFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const productId = getProductId(req);

    if (!productId) {
      throw new AppError("product is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("invalid product id", 400);
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true },
    ).populate("products");

    if (!wishlist) {
      throw new AppError("wishlist not found", 404);
    }

    sendResponse(res, {
      message: "product removed from wishlist",
      statusCode: 200,
      data: wishlist,
    });
  },
);

//! clear wishlist
export const clearWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    { products: [] },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).populate("products");

  sendResponse(res, {
    message: "wishlist cleared",
    statusCode: 200,
    data: wishlist,
  });
});

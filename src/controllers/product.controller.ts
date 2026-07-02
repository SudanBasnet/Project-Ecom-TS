import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Product from "../models/product.model";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import Category from "../models/category.model";
import Brand from "../models/brand.model";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/cloudinary.utils";
import mongoose from "mongoose";
import { getPagination } from "../utils/pagination.utils";

const folder = "/products";

//* get all products
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const {
    query,
    category,
    brand,
    minPrice,
    maxPrice,
    limit = "10",
    page = "1",
  } = req.query;
  const perPage = Number(limit);
  const currPage = Number(page);
  const skip = (currPage - 1) * perPage;
  const filter: mongoose.QueryFilter<any> = {};
  if (query) {
    filter.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
      {
        description: { $regex: query, $options: "i" },
      },
    ];
  }
  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  //! price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }
  const products = await Product.find(filter)
    .populate("category")
    .populate("brand")
    .skip(skip)
    .limit(perPage);
  const count = await Product.countDocuments(filter);
  const { total_count, total_pages, current_page, next_page, prev_page } =
    getPagination(count, perPage, currPage);

  sendResponse(res, {
    message: "Products fetched",
    statusCode: 200,
    data: products,
    meta: {
      total_count,
      total_pages,
      current_page,
      next_page,
      prev_page,
    },
  });
});
//* get by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id })
    .populate("category")
    .populate("brand");

  if (!product) {
    throw new AppError(`product ${id} not found `, 404);
  }

  sendResponse(res, {
    message: `Product ${id} fetched`,
    statusCode: 200,
    data: product,
  });
});

//* create
export const create = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    new_arrival,
    featured,
  } = req.body;

  //! files
  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;
  const cover_image = files?.cover_image;
  const images = files?.images;

  if (!name || !price || !stock) {
    throw new AppError("name , price & stock are required", 400);
  }

  if (!category) {
    throw new AppError("category required", 400);
  }
  if (!brand) {
    throw new AppError("brand required", 400);
  }

  if (!cover_image?.[0]) {
    throw new AppError("cover_image is required", 400);
  }
  const product = new Product({
    name,
    stock,
    price,
    description,
    new_arrival,
    featured,
  });

  const p_category = await Category.findOne({ _id: category });
  if (!p_category) {
    throw new AppError("Category not found", 400);
  }
  const p_brand = await Brand.findOne({ _id: brand });
  if (!p_brand) {
    throw new AppError("Brand not found", 400);
  }
  product.category = p_category._id;
  product.brand = p_brand._id;
  //todo images
  //* cover image
  const { path, public_id } = await sendFileToCloudinary(
    cover_image[0],
    folder,
  );
  product.cover_image = {
    path,
    public_id,
  };

  // * images
  if (images && Array.isArray(images) && images.length > 0) {
    const promises = images.map(
      async (file) => await sendFileToCloudinary(file, folder),
    );

    const files = await Promise.all(promises);
    product.image = files as any;
  }

  //! save product
  await product.save();

  sendResponse(res, {
    message: `Product ${product._id} created`,
    statusCode: 201,
    data: product,
  });
});

//* update
export const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    new_arrival,
    featured,
  } = req.body;

  const product: any = await Product.findOne({ _id: id });

  if (!product) {
    throw new AppError(`product ${id} not found`, 404);
  }

  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;
  const cover_image = files?.cover_image;
  const images = files?.images;

  if (category) {
    const p_category = await Category.findOne({ _id: category });

    if (!p_category) {
      throw new AppError("Category not found", 400);
    }

    product.category = p_category._id;
  }

  if (brand) {
    const p_brand = await Brand.findOne({ _id: brand });

    if (!p_brand) {
      throw new AppError("Brand not found", 400);
    }

    product.brand = p_brand._id;
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (new_arrival !== undefined) product.new_arrival = new_arrival;
  if (featured !== undefined) product.featured = featured;

  if (cover_image && cover_image[0]) {
    if (product.cover_image?.public_id) {
      await deleteFileFromCloudinary(product.cover_image.public_id);
    }

    const { path, public_id } = await sendFileToCloudinary(
      cover_image[0],
      folder,
    );

    product.cover_image = {
      path,
      public_id,
    };
  }

  if (images && Array.isArray(images) && images.length > 0) {
    if (Array.isArray(product.image)) {
      await Promise.all(
        product.image.map((file: { public_id?: string }) =>
          file.public_id ? deleteFileFromCloudinary(file.public_id) : null,
        ),
      );
    }

    const promises = images.map(
      async (file) => await sendFileToCloudinary(file, folder),
    );

    product.image = await Promise.all(promises);
  }

  await product.save();

  sendResponse(res, {
    message: `Product ${id} updated`,
    statusCode: 200,
    data: product,
  });
});

//* remove
export const remove = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product: any = await Product.findOne({ _id: id });

  if (!product) {
    throw new AppError(`product ${id} not found`, 404);
  }

  if (product.cover_image?.public_id) {
    await deleteFileFromCloudinary(product.cover_image.public_id);
  }

  if (Array.isArray(product.image)) {
    await Promise.all(
      product.image.map((file: { public_id?: string }) =>
        file.public_id ? deleteFileFromCloudinary(file.public_id) : null,
      ),
    );
  }

  await product.deleteOne();

  sendResponse(res, {
    message: `Product ${id} deleted`,
    statusCode: 200,
    data: product,
  });
});

//* get by category
export const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const products = await Product.find({ category: id })
    .populate("category")
    .populate("brand");

  sendResponse(res, {
    message: `Product by category ${id} fetched`,
    statusCode: 200,
    data: products,
  });
});
//* get all featured products
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({ featured: true })
      .populate("category")
      .populate("brand");

    sendResponse(res, {
      message: `All featured Products fetched`,
      statusCode: 200,
      data: products,
    });
  },
);

//* get all new arrivals
export const getNewProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({ new_arrival: true })
      .populate("category")
      .populate("brand");

    sendResponse(res, {
      message: `All new arrivals  fetched`,
      statusCode: 200,
      data: products,
    });
  },
);

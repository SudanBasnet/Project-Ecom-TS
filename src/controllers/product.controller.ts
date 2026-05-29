import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Product from "../models/product.model";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import Category from "../models/category.model";
import Brand from "../models/brand.model";
import { sendFileToCloudinary } from "../utils/cloudinary.utils";

const folder = "/products";

//* get all products
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const products = await Product.find(filter);

  sendResponse(res, {
    message: "Products fetched",
    statusCode: 200,
    data: products,
  });
});
//* get by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });

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
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (!name || !price || !stock) {
    throw new AppError("name , price & stock are required", 400);
  }

  if (!category) {
    throw new AppError("category required", 400);
  }
  if (!brand) {
    throw new AppError("brand required", 400);
  }

  if (!cover_image[0]) {
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
    product.images = files as any;
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
//* remove
//* get by category
export const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const products = await Product.find({ category: categoryId });

  sendResponse(res, {
    message: `Product by category ${categoryId} fetched`,
    statusCode: 200,
    data: products,
  });
});
//* get all featured products
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({ featured: true });

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
    const products = await Product.find({ new_arrival: true });

    sendResponse(res, {
      message: `All new arrivals  fetched`,
      statusCode: 200,
      data: products,
    });
  },
);

import { NextFunction, Request, Response } from "express";
import Category from "../models/category.model";
import { catchAsync } from "../utils/catchAsync.utils";
import appError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//! get all categories
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    sendResponse(res, {
      message: "categories fetched",
      data: categories,
      statusCode: 200,
    });
  },
);
//! get category by id
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new appError(`category ${id} not found`, 404);
    }
    sendResponse(res, {
      message: `category ${id} fetched`,
      data: category,
      statusCode: 200,
    });
  },
);

//! create category
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
      throw new appError("Category name is required", 400);
    }

    // const category = await Category.create({
    //   name,
    //   description,
    // });

    const category = new Category({ name, description });

    //todo: handle image

    //?save category
    await category.save();
    sendResponse(res, {
      message: "Category created",
      data: category,
      statusCode: 201,
    });
  },
);

//! update category
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new appError(`Category ${id} not found`, 404);
    }
    if (name) category.name = name;
    if (description) category.description = description;
    await category.save();

    sendResponse(res, {
      message: `Category ${id} updated`,
      data: category,
      statusCode: 200,
    });
  },
);

//! delete category
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new appError(`Category ${id} not found`, 404);
    }

    await category.deleteOne();

    sendResponse(res, {
      message: "Category deleted",
      data: null,
      statusCode: 200,
    });
  },
);

//!get all

//!get bby id

//!create

//!update

//!delete

import { NextFunction, Request, Response } from "express";
import Category from "../models/category.model";

//! get all categories
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories fetched",
      data: categories,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      statusCode: error?.statusCode || 500,
      success: false,
    });
  }
};

//! get category by id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Category fetched",
      data: category,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      statusCode: error?.statusCode || 500,
      success: false,
    });
  }
};

//! create category
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      const error: any = new Error("Name is required");
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created",
      data: category,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      statusCode: error?.statusCode || 500,
      success: false,
    });
  }
};

//! update category
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      message: "Category updated",
      data: updatedCategory,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      statusCode: error?.statusCode || 500,
      success: false,
    });
  }
};

//! delete category
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      const error: any = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted",
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      statusCode: error?.statusCode || 500,
      success: false,
    });
  }
};
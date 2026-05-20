//controllers/brand.controller.ts

import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import appError from "../utils/appError.utils";

//!create brand
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
      throw new appError("Brand name is required", 400);
    }

    const brand = await Brand.create({
      name,
      description,
    });

    sendResponse(res, {
      message: "Brand created",
      data: brand,
      statusCode: 201,
    });
  },
);

//!get all brands
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.find();

    sendResponse(res, {
      message: "Brands fetched",
      data: brands,
      statusCode: 200,
    });
  },
);

//!get brand by id
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      throw new appError(`Brand ${id} not found`, 404);
    }

    sendResponse(res, {
      message: `Brand ${id} fetched`,
      data: brand,
      statusCode: 200,
    });
  },
);

//!update brand
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      throw new appError("Brand not found", 404);
    }

    //! update only provided fields
    if (name) {
      brand.name = name;
    }

    if (description) {
      brand.description = description;
    }

    await brand.save();

    sendResponse(res, {
      message: "Brand updated",
      data: brand,
      statusCode: 200,
    });
  },
);

//!delete brand
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      throw new appError("Brand not found", 404);
    }

    await brand.deleteOne();

    sendResponse(res, {
      message: "Brand deleted",
      data: null,
      statusCode: 200,
    });
  },
);

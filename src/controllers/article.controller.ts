import { Request, Response } from "express";
import Article from "../models/article.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

export const getAll = catchAsync(async (_req: Request, res: Response) => {
  const articles = await Article.find().sort({ featured: -1, createdAt: -1 });

  sendResponse(res, {
    message: "articles fetched",
    data: articles,
    statusCode: 200,
  });
});

import { Response } from "express";

type TResponse<T> = {
  message: string;
  data: T;
  statusCode: number;
  meta?: {
    total_count: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    message: data.message,
    data: {
      data: data.data,
      pagination: data.meta,
    },
    status: "success",
    success: true,
  });
};

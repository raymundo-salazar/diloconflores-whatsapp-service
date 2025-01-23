import { Request, NextFunction } from "express";
import { Response, ResponseData } from "./types";

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.data !== undefined) {
    const response: ResponseData = {
      success: true,
      data: res.data,
      message: res.message || "Operation successful",
    };
    return res.status(res.statusCode || 200).json(response);
  }

  next();
};

export const successResponse = (
  res: Response,
  data: any,
  message = "Operation successful",
  statusCode = 200
) => {
  res.data = data;
  res.message = message;
  res.statusCode = statusCode;
};

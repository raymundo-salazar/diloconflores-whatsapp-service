// src/middleware/notFoundHandler.ts
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@helpers/errors";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError("Endpoint", req.originalUrl));
};

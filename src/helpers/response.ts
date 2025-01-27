import { Response, Request } from "express";
import { totalmem } from "os";

interface Totals {
  show: number;
  total: number;
}

interface Pages {
  current: number;
  totalPages: number;
  next?: number | null;
  previous?: number | null;
}

interface Info {
  totals: Totals;
  pages: Pages;
}

export const successResponse = (
  req: Request,
  res: Response,
  data: any,
  message: string = "Operation successful",
  status: number = 200,
  info?: Info | undefined
) => {
  let next, previous;
  if (info) {
    next = info.pages.current + 1;
    if (next > info.pages.totalPages) {
      next = null;
    }

    previous = info.pages.current - 1;
    if (previous < 1) {
      previous = 1;
    }

    info = {
      ...info,
      pages: {
        ...info.pages,
        next,
        previous,
      },
    };
  }

  return res.status(status).json({
    success: true,
    message,
    data,
    info,
    lang: req.language,
  });
};

export const errorResponse = (
  res: Response,
  errorMessage: string,
  status: number = 500,
  resource: string | undefined = undefined
) => {
  return res.status(status).json({
    success: false,
    error: {
      code: status,
      message: errorMessage,
      resource,
    },
  });
};

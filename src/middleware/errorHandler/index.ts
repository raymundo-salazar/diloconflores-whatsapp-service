import { Request, Response, NextFunction } from "express";
import { CreationError, CustomError, MissingParametersError, DatabaseError } from "@helpers/errors";
const { NODE_ENV, SHOW_ERRORS = true } = process.env;

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let message = err.message;
  if (message.startsWith("api.")) message = req.t(message);

  const { show_errors: _show_errors = SHOW_ERRORS } = req.query;
  const show_errors = _show_errors && _show_errors != "false";

  const stack = NODE_ENV !== "production" ? err.stack?.split("\n") : undefined;
  if (NODE_ENV !== "production" && SHOW_ERRORS && show_errors) console.log(err);

  if (
    ["SequelizeDatabaseError", "SequelizeValidationError"].includes(err.name) ||
    err.name.search("Sequelize") !== -1
  )
    err = new DatabaseError(err as any);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.errorType,
        database_code: err.database_code,
        message: message,
        resource: err.resource,
        sql: NODE_ENV !== "production" ? err.sql : undefined,
        errors: err.errors,
        bodySent: req.body,
        paramsSent: req.params,
        stack,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      type: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      stack,
    },
  });
};

import { Request, Response, NextFunction } from "express";
import sequelize from "@config/db";
import { version } from "../../../package.json";
import { DatabaseError } from "@helpers/errors";
import { successResponse } from "@helpers/response";
import { checkEnvVariables, checkSystemResources } from "./services";

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = process.hrtime();

  try {
    await sequelize.authenticate();
    const uptime = process.uptime();
    const uptimeString = `${Math.floor(uptime / 3600)}h ${Math.floor(
      (uptime % 3600) / 60
    )}m ${Math.floor(uptime % 60)}s`;

    const systemResources = checkSystemResources();
    const envStatus = checkEnvVariables();

    const responseTime = process.hrtime(startTime);
    const responseTimeMs = (
      responseTime[0] * 1000 +
      responseTime[1] / 1e6
    ).toFixed(2);

    const data = {
      status: "OK",
      uptime: uptimeString,
      timestamp: new Date().toISOString(),
      version,
      environment: process.env.NODE_ENV || "development",
      db: { status: "connected" },
      systemResources,
      envStatus,
      responseTime: `${responseTimeMs} ms`,
    };

    successResponse(res, data, "Health check successful");
  } catch (error) {
    next(new DatabaseError(error));
  }
};

export const liveness = async (req: Request, res: Response) => {
  successResponse(res, { status: "Alive" }, "Alive");
};

export const readiness = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sequelize.authenticate();
    successResponse(res, { status: "Ready" }, "Ready");
  } catch (error) {
    next(new DatabaseError(error));
  }
};

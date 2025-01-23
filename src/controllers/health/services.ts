import os from "os";

export const checkEnvVariables = () => {
  const requiredEnvVars = ["DB_HOST", "DB_NAME", "NODE_ENV"];
  const missingVars = requiredEnvVars.filter((env) => !process.env[env]);

  return {
    missingEnvVars: missingVars.length > 0 ? missingVars : null,
  };
};

export const checkSystemResources = () => {
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

  return {
    cpuLoad: os.loadavg(),
    memoryUsage: `${memoryUsage.toFixed(2)}%`,
    freeMemory: `${(freeMemory / 1024 / 1024).toFixed(2)} MB`,
    totalMemory: `${(totalMemory / 1024 / 1024).toFixed(2)} MB`,
  };
};

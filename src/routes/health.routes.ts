import { Router } from "express";

export const healthRoutes = Router();

healthRoutes.get("/health", (_request, response) => {
  return response.status(200).json({
    status: "ok",
    service: "jenforce-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

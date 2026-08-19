import { Router } from "express";
import { register } from "../config/metrics";

export const metricsRoutes = Router();

metricsRoutes.get("/metrics", async (_request, response) => {
  response.setHeader("Content-Type", register.contentType);

  return response.send(await register.metrics());
});

import type { NextFunction, Response } from "express";
import { httpErrorsTotal, httpRequestDurationSeconds, httpRequestsTotal } from "../config/metrics";
import type { AuthenticatedRequest } from "./auth.middleware";

function normalizeRoute(request: AuthenticatedRequest) {
  if (request.route?.path) {
    const baseUrl = request.baseUrl || "";
    const routePath = String(request.route.path);

    return `${baseUrl}${routePath}`;
  }

  return request.path || "unknown";
}

export function metricsMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) {
  const startTime = process.hrtime.bigint();

  response.on("finish", () => {
    const durationInSeconds = Number(process.hrtime.bigint() - startTime) / 1_000_000_000;

    const labels = {
      method: request.method,
      route: normalizeRoute(request),
      status_code: String(response.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(labels, durationInSeconds);

    if (response.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });

  next();
}

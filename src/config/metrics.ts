import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from "prom-client";

collectDefaultMetrics({
  register,
  prefix: "jenforce_",
});

export const httpRequestsTotal = new Counter({
  name: "jenforce_http_requests_total",
  help: "Total de requisições HTTP recebidas pela Jenforce API.",
  labelNames: ["method", "route", "status_code"],
});

export const httpErrorsTotal = new Counter({
  name: "jenforce_http_errors_total",
  help: "Total de respostas HTTP com status code de erro na Jenforce API.",
  labelNames: ["method", "route", "status_code"],
});

export const httpRequestDurationSeconds = new Histogram({
  name: "jenforce_http_request_duration_seconds",
  help: "Latência das requisições HTTP na Jenforce API em segundos.",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

export { register };

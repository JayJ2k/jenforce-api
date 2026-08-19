import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRoutes } from "./routes/auth.routes";
import { commentRoutes } from "./routes/comment.routes";
import { healthRoutes } from "./routes/health.routes";
import { ticketRoutes } from "./routes/ticket.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  return response.json({
    message: "Jenforce API is running",
    product: "Jenforce",
    description: "Central de chamados para suporte técnico e atendimento interno.",
  });
});

app.use(healthRoutes);
app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/", commentRoutes);

export { app };

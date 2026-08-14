import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";
import { ticketRoutes } from "./routes/ticket.routes";
import { commentRoutes } from "./routes/comment.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3334;

app.get("/", (request, response) => {
  return response.json({
    message: "Jenforce API is running",
    product: "Jenforce",
    description:
      "Central de chamados para suporte técnico e atendimento interno.",
  });
});

app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/", commentRoutes);

app.listen(PORT, () => {
  console.log(`Jenforce API is running on port ${PORT}`);
});
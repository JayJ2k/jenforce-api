import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  listTickets,
  updateTicket,
} from "../controllers/ticket.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const ticketRoutes = Router();

ticketRoutes.post("/", authMiddleware, createTicket);
ticketRoutes.get("/", authMiddleware, listTickets);
ticketRoutes.get("/:id", authMiddleware, getTicketById);
ticketRoutes.put("/:id", authMiddleware, updateTicket);
ticketRoutes.delete("/:id", authMiddleware, deleteTicket);

export { ticketRoutes };
import { Router } from "express";
import {
  createComment,
  listComments,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const commentRoutes = Router();

commentRoutes.post("/tickets/:ticketId/comments", authMiddleware, createComment);
commentRoutes.get("/tickets/:ticketId/comments", authMiddleware, listComments);

export { commentRoutes };
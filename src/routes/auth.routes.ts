import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, me);

export { authRoutes };
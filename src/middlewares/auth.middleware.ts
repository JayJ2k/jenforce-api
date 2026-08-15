import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
  role: UserRole;
};

export type AuthenticatedRequest = Request & {
  userId?: string;
  userRole?: UserRole;
};

export function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token não informado.",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return response.status(401).json({
      message: "Token inválido.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jenforce-local-secret",
    ) as TokenPayload;

    request.userId = decoded.sub;
    request.userRole = decoded.role;

    return next();
  } catch {
    return response.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}

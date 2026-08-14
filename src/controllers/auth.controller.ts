import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

function generateToken(userId: string, role: UserRole) {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    process.env.JWT_SECRET || "jenforce-local-secret",
    {
      expiresIn: "7d",
    }
  );
}

export async function register(request: Request, response: Response) {
  const { name, email, password } = request.body;
  const roleFromBody = request.body.role as UserRole | undefined;

  if (!name || !email || !password) {
    return response.status(400).json({
      message: "Nome, email e senha são obrigatórios.",
    });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (userAlreadyExists) {
    return response.status(409).json({
      message: "Já existe um usuário cadastrado com este email.",
    });
  }

  const allowedRoles = Object.values(UserRole);

  const selectedRole =
    roleFromBody && allowedRoles.includes(roleFromBody)
      ? roleFromBody
      : UserRole.CUSTOMER;

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: selectedRole,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return response.status(201).json({
    message: "Usuário cadastrado com sucesso.",
    user,
  });
}

export async function login(request: Request, response: Response) {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: "Email e senha são obrigatórios.",
    });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    return response.status(401).json({
      message: "Email ou senha inválidos.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return response.status(401).json({
      message: "Email ou senha inválidos.",
    });
  }

  const token = generateToken(user.id, user.role);

  return response.json({
    message: "Login realizado com sucesso.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function me(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;

  if (!userId) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado.",
    });
  }

  return response.json({
    user,
  });
}
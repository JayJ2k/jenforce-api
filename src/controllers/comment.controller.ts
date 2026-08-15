import { UserRole } from "@prisma/client";
import type { Response } from "express";
import { prisma } from "../config/prisma";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

function canAccessTicket(userId: string, userRole: UserRole, requesterId: string) {
  if (userRole === UserRole.ADMIN || userRole === UserRole.AGENT) {
    return true;
  }

  return userId === requesterId;
}

export async function createComment(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;
  const { ticketId } = request.params as { ticketId: string };
  const { content } = request.body;

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  if (!content || !String(content).trim()) {
    return response.status(400).json({
      message: "O comentário não pode estar vazio.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    return response.status(404).json({
      message: "Chamado não encontrado.",
    });
  }

  if (!canAccessTicket(userId, userRole, ticket.requesterId)) {
    return response.status(403).json({
      message: "Você não tem permissão para comentar neste chamado.",
    });
  }

  const comment = await prisma.ticketComment.create({
    data: {
      content,
      ticketId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return response.status(201).json({
    message: "Comentário adicionado ao chamado.",
    comment,
  });
}

export async function listComments(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;
  const { ticketId } = request.params as { ticketId: string };

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    return response.status(404).json({
      message: "Chamado não encontrado.",
    });
  }

  if (!canAccessTicket(userId, userRole, ticket.requesterId)) {
    return response.status(403).json({
      message: "Você não tem permissão para visualizar este histórico.",
    });
  }

  const comments = await prisma.ticketComment.findMany({
    where: {
      ticketId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return response.json({
    comments,
  });
}

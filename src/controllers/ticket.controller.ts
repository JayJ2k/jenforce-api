import {
  type Prisma,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  UserRole,
} from "@prisma/client";
import type { Response } from "express";
import { prisma } from "../config/prisma";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

function generateProtocol() {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);

  return `JF-${year}-${timestamp}`;
}

function isValidEnumValue<T extends object>(enumObject: T, value: unknown) {
  return Object.values(enumObject).includes(value as T[keyof T]);
}

function canAccessTicket(userId: string, userRole: UserRole, requesterId: string) {
  if (userRole === UserRole.ADMIN || userRole === UserRole.AGENT) {
    return true;
  }

  return userId === requesterId;
}

export async function createTicket(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const { title, description, priority, category } = request.body;

  if (!userId) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  if (!title || !description || !category) {
    return response.status(400).json({
      message: "Título, descrição e categoria são obrigatórios.",
    });
  }

  if (!isValidEnumValue(TicketCategory, category)) {
    return response.status(400).json({
      message: "Categoria inválida.",
    });
  }

  const selectedPriority =
    priority && isValidEnumValue(TicketPriority, priority) ? priority : TicketPriority.MEDIUM;

  const ticket = await prisma.ticket.create({
    data: {
      protocol: generateProtocol(),
      title,
      description,
      category,
      priority: selectedPriority,
      requesterId: userId,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: true,
    },
  });

  return response.status(201).json({
    message: "Chamado aberto com sucesso.",
    ticket,
  });
}

export async function listTickets(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const { status, priority, category, search } = request.query;

  const where: Prisma.TicketWhereInput = {};

  if (userRole === UserRole.CUSTOMER) {
    where.requesterId = userId;
  }

  if (typeof status === "string" && isValidEnumValue(TicketStatus, status)) {
    where.status = status as TicketStatus;
  }

  if (typeof priority === "string" && isValidEnumValue(TicketPriority, priority)) {
    where.priority = priority as TicketPriority;
  }

  if (typeof category === "string" && isValidEnumValue(TicketCategory, category)) {
    where.category = category as TicketCategory;
  }

  if (typeof search === "string" && search.trim()) {
    where.OR = [
      {
        title: {
          contains: search,
        },
      },
      {
        protocol: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
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
      },
    },
  });

  return response.json({
    tickets,
  });
}

export async function getTicketById(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;
  const { id } = request.params as { id: string };

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
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
      },
    },
  });

  if (!ticket) {
    return response.status(404).json({
      message: "Chamado não encontrado.",
    });
  }

  if (!canAccessTicket(userId, userRole, ticket.requesterId)) {
    return response.status(403).json({
      message: "Você não tem permissão para acessar este chamado.",
    });
  }

  return response.json({
    ticket,
  });
}

export async function updateTicket(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;
  const { id } = request.params as { id: string };
  const { title, description, status, priority, category, assigneeId } = request.body;

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
  });

  if (!ticket) {
    return response.status(404).json({
      message: "Chamado não encontrado.",
    });
  }

  if (!canAccessTicket(userId, userRole, ticket.requesterId)) {
    return response.status(403).json({
      message: "Você não tem permissão para atualizar este chamado.",
    });
  }

  const data: Prisma.TicketUpdateInput = {};

  if (title) {
    data.title = title;
  }

  if (description) {
    data.description = description;
  }

  if (status && isValidEnumValue(TicketStatus, status)) {
    data.status = status;
  }

  if (priority && isValidEnumValue(TicketPriority, priority)) {
    data.priority = priority;
  }

  if (category && isValidEnumValue(TicketCategory, category)) {
    data.category = category;
  }

  if (assigneeId && (userRole === UserRole.ADMIN || userRole === UserRole.AGENT)) {
    data.assignee = {
      connect: {
        id: assigneeId,
      },
    };
  }

  const updatedTicket = await prisma.ticket.update({
    where: {
      id,
    },
    data,
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
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
      },
    },
  });

  return response.json({
    message: "Chamado atualizado com sucesso.",
    ticket: updatedTicket,
  });
}

export async function deleteTicket(request: AuthenticatedRequest, response: Response) {
  const userId = request.userId;
  const userRole = request.userRole;
  const { id } = request.params as { id: string };

  if (!userId || !userRole) {
    return response.status(401).json({
      message: "Usuário não autenticado.",
    });
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
  });

  if (!ticket) {
    return response.status(404).json({
      message: "Chamado não encontrado.",
    });
  }

  if (!canAccessTicket(userId, userRole, ticket.requesterId)) {
    return response.status(403).json({
      message: "Você não tem permissão para excluir este chamado.",
    });
  }

  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  return response.json({
    message: "Chamado excluído com sucesso.",
  });
}

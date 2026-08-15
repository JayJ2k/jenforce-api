import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/config/prisma";

const testEmail = `security-${Date.now()}@jenforce.com`;

describe("Jenforce API - validações de autenticação", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  it("deve responder na rota raiz", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.product).toBe("Jenforce");
    expect(response.body.message).toBe("Jenforce API is running");
  });

  it("deve bloquear cadastro sem campos obrigatórios", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "incompleto@jenforce.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Nome, email e senha são obrigatórios.");
  });

  it("deve criar cadastro público sempre como CUSTOMER", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Teste Segurança",
      email: testEmail,
      password: "123456",
      role: "ADMIN",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("CUSTOMER");
    expect(response.body.user.password).toBeUndefined();
  });

  it("deve bloquear login com credenciais inválidas", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "usuario-inexistente@jenforce.com",
      password: "senha-incorreta",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email ou senha inválidos.");
  });

  it("deve bloquear rota protegida sem token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token não informado.");
  });
});

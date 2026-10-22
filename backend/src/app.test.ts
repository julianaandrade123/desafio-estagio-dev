import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

const validPayload = {
  name: "Pessoa Fictícia",
  email: "pessoa@example.com",
  cpf: "52998224725",
  salary: 5000,
  employerCnpj: "11222333000181",
  requestedAmount: 10000,
  termMonths: 24,
  demoScenario: "normal"
};

describe("API de simulação", () => {
  it("valida entrada e devolve resultados por instituição", async () => {
    const response = await request(createApp()).post("/api/simulations").send(validPayload);
    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(2);
    expect(response.body.results.map((r: { bank: string }) => r.bank)).toEqual([
      "Banco Aurora", "Banco Horizonte"
    ]);
  });

  it("retorna 400 para dados inválidos", async () => {
    const response = await request(createApp()).post("/api/simulations").send({
      ...validPayload,
      email: "email-invalido"
    });
    expect(response.status).toBe(400);
    expect(response.body.details).toBeDefined();
  });

  it("mantém o resultado do Horizonte se Aurora estiver indisponível", async () => {
    const response = await request(createApp()).post("/api/simulations").send({
      ...validPayload,
      demoScenario: "aurora-unavailable"
    });
    expect(response.status).toBe(200);
    expect(response.body.results[0].status).toBe("unavailable");
    expect(["approved", "rejected"]).toContain(response.body.results[1].status);
  });
});

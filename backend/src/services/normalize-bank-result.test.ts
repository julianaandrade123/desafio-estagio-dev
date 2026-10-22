import { describe, expect, it } from "vitest";
import { normalizeAurora, normalizeHorizonte } from "./normalize-bank-result.js";
import type { SimulationInput } from "../types.js";

const input: SimulationInput = {
  name: "Pessoa Fictícia",
  email: "pessoa@example.com",
  cpf: "52998224725",
  salary: 5000,
  employerCnpj: "11222333000181",
  requestedAmount: 10000,
  termMonths: 24,
  demoScenario: "normal"
};

describe("normalização de respostas bancárias", () => {
  it("converte aprovação do Aurora para o contrato comum", () => {
    const result = normalizeAurora({
      institution: "Banco Aurora",
      decision: "ACCEPTED",
      monthlyRate: 0.019,
      amountApproved: 10000,
      note: "Aprovado"
    }, input);
    expect(result.status).toBe("approved");
    expect(result.monthlyPayment).toBeGreaterThan(0);
  });

  it("converte reprovação do Horizonte para o contrato comum", () => {
    const result = normalizeHorizonte({
      bankName: "Banco Horizonte",
      result: "REJECTED",
      rate: 0.022,
      maximumValue: 0,
      rejectionMessage: "Critério não atendido"
    }, input);
    expect(result.status).toBe("rejected");
    expect(result.reason).toContain("Critério");
  });

  it("rejeita contrato externo inesperado", () => {
    expect(() => normalizeAurora({ wrong: true }, input)).toThrow();
  });
});

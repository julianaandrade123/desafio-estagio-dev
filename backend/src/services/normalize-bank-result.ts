import type { BankResult, SimulationInput } from "../types.js";

function calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * (monthlyRate * factor) / (factor - 1);
}

export function normalizeAurora(raw: unknown, input: SimulationInput): BankResult {
  if (!raw || typeof raw !== "object") throw new Error("Resposta inválida do Banco Aurora.");
  const data = raw as Record<string, unknown>;
  if (data.institution !== "Banco Aurora" || !["ACCEPTED", "DENIED"].includes(String(data.decision))) {
    throw new Error("Contrato inesperado do Banco Aurora.");
  }
  if (data.decision === "DENIED") {
    return { bank: "Banco Aurora", status: "rejected", reason: String(data.note ?? "Solicitação não aprovada.") };
  }
  const rate = Number(data.monthlyRate);
  const amount = Number(data.amountApproved);
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Valores inválidos na resposta do Banco Aurora.");
  }
  return {
    bank: "Banco Aurora",
    status: "approved",
    interestRateMonthly: rate,
    approvedAmount: amount,
    monthlyPayment: calculateMonthlyPayment(amount, rate, input.termMonths),
    reason: String(data.note ?? "Solicitação aprovada no cenário fictício.")
  };
}

export function normalizeHorizonte(raw: unknown, input: SimulationInput): BankResult {
  if (!raw || typeof raw !== "object") throw new Error("Resposta inválida do Banco Horizonte.");
  const data = raw as Record<string, unknown>;
  if (data.bankName !== "Banco Horizonte" || !["APPROVED", "REJECTED"].includes(String(data.result))) {
    throw new Error("Contrato inesperado do Banco Horizonte.");
  }
  if (data.result === "REJECTED") {
    return { bank: "Banco Horizonte", status: "rejected", reason: String(data.rejectionMessage ?? "Solicitação não aprovada.") };
  }
  const rate = Number(data.rate);
  const amount = Number(data.maximumValue);
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Valores inválidos na resposta do Banco Horizonte.");
  }
  return {
    bank: "Banco Horizonte",
    status: "approved",
    interestRateMonthly: rate,
    approvedAmount: amount,
    monthlyPayment: calculateMonthlyPayment(amount, rate, input.termMonths),
    reason: "Solicitação aprovada no cenário fictício."
  };
}

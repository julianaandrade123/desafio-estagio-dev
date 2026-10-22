export type BankStatus = "approved" | "rejected" | "unavailable";

export interface SimulationInput {
  name: string;
  email: string;
  cpf: string;
  salary: number;
  employerCnpj: string;
  requestedAmount: number;
  termMonths: number;
  demoScenario: "normal" | "aurora-unavailable";
}

export interface BankResult {
  bank: string;
  status: BankStatus;
  interestRateMonthly?: number;
  monthlyPayment?: number;
  approvedAmount?: number;
  reason?: string;
  message?: string;
}

export interface SimulationResponse {
  simulationId: string;
  createdAt: string;
  results: BankResult[];
  disclaimer: string;
}

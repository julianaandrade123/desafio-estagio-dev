import type { BankAdapter } from "./bank.types.js";
import type { SimulationInput } from "../types.js";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class BankAuroraAdapter implements BankAdapter {
  async simulate(input: SimulationInput): Promise<unknown> {
    if (input.demoScenario === "aurora-unavailable") {
      await wait(350);
      throw new Error("Banco Aurora indisponível no cenário de demonstração.");
    }

    await wait(450);
    // Contrato fictício próprio do Banco Aurora.
    const eligible = input.salary >= 1800 && input.requestedAmount <= input.salary * 12;
    return eligible
      ? {
          institution: "Banco Aurora",
          decision: "ACCEPTED",
          monthlyRate: 0.019,
          amountApproved: input.requestedAmount,
          note: "Perfil elegível segundo as regras fictícias do simulador."
        }
      : {
          institution: "Banco Aurora",
          decision: "DENIED",
          denialCode: "INCOME_OR_AMOUNT",
          note: "Os critérios fictícios de renda ou valor não foram atendidos."
        };
  }
}

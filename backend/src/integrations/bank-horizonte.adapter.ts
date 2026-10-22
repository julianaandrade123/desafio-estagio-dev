import type { BankAdapter } from "./bank.types.js";
import type { SimulationInput } from "../types.js";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class BankHorizonteAdapter implements BankAdapter {
  async simulate(input: SimulationInput): Promise<unknown> {
    await wait(650);
    // Contrato fictício diferente do Banco Aurora.
    const eligible = input.salary >= 2500 && input.requestedAmount <= input.salary * 10;
    return {
      bankName: "Banco Horizonte",
      result: eligible ? "APPROVED" : "REJECTED",
      rate: 0.022,
      maximumValue: eligible ? input.requestedAmount : 0,
      rejectionMessage: eligible ? undefined : "Critérios fictícios de elegibilidade não atendidos."
    };
  }
}

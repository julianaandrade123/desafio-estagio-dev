import { randomUUID } from "node:crypto";
import type { BankAdapter } from "../integrations/bank.types.js";
import { BankAuroraAdapter } from "../integrations/bank-aurora.adapter.js";
import { BankHorizonteAdapter } from "../integrations/bank-horizonte.adapter.js";
import { normalizeAurora, normalizeHorizonte } from "./normalize-bank-result.js";
import type { SimulationInput, SimulationResponse, BankResult } from "../types.js";

export class SimulationService {
  constructor(
    private readonly aurora: BankAdapter = new BankAuroraAdapter(),
    private readonly horizonte: BankAdapter = new BankHorizonteAdapter()
  ) {}

  async simulate(input: SimulationInput): Promise<SimulationResponse> {
    const settled = await Promise.allSettled([
      this.aurora.simulate(input),
      this.horizonte.simulate(input)
    ]);

    const results: BankResult[] = settled.map((outcome, index) => {
      const bank = index === 0 ? "Banco Aurora" : "Banco Horizonte";
      if (outcome.status === "rejected") {
        return {
          bank,
          status: "unavailable",
          message: "Não foi possível consultar esta instituição agora. Tente novamente mais tarde."
        };
      }
      try {
        return index === 0
          ? normalizeAurora(outcome.value, input)
          : normalizeHorizonte(outcome.value, input);
      } catch {
        return {
          bank,
          status: "unavailable",
          message: "A instituição retornou uma resposta que não pôde ser interpretada."
        };
      }
    });

    return {
      simulationId: randomUUID(),
      createdAt: new Date().toISOString(),
      results,
      disclaimer: "Simulação demonstrativa com dados e critérios fictícios. Não representa oferta ou aprovação real de crédito."
    };
  }
}

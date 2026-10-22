import type { SimulationInput } from "../types.js";

export interface BankAdapter {
  simulate(input: SimulationInput): Promise<unknown>;
}

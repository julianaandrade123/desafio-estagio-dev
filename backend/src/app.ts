import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import { simulationSchema } from "./schemas/simulation.schema.js";
import { SimulationService } from "./services/simulation.service.js";

export function createApp(service = new SimulationService()) {
  const app = express();
  app.use(cors({ origin: "http://localhost:5173" }));
  app.use(express.json({ limit: "20kb" }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.post("/api/simulations", async (req, res) => {
    const parsed = simulationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Dados inválidos.",
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    try {
      const result = await service.simulate(parsed.data);
      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ error: "Não foi possível concluir a simulação. Tente novamente." });
    }
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof SyntaxError) return res.status(400).json({ error: "JSON inválido." });
    return res.status(500).json({ error: "Erro interno inesperado." });
  });

  return app;
}

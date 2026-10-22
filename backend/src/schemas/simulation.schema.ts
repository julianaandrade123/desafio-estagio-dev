import { z } from "zod";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

function isValidCpf(value: string): boolean {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calculate = (base: string, factor: number) => {
    let sum = 0;
    for (const digit of base) sum += Number(digit) * factor--;
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return calculate(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calculate(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function isValidCnpj(value: string): boolean {
  const cnpj = digitsOnly(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const digit = (base: string, weights: number[]) => {
    const sum = [...base].reduce((acc, n, i) => acc + Number(n) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = digit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = digit(cnpj.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === Number(cnpj[12]) && second === Number(cnpj[13]);
}

export const simulationSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo.").max(100),
  email: z.string().trim().email("Informe um e-mail válido.").max(150),
  cpf: z.string().refine(isValidCpf, "Informe um CPF válido (use dados fictícios)."),
  salary: z.number().finite().positive("O salário deve ser maior que zero.").max(1_000_000),
  employerCnpj: z.string().refine(isValidCnpj, "Informe um CNPJ válido (use dados fictícios)."),
  requestedAmount: z.number().finite().positive("O valor solicitado deve ser maior que zero.").max(500_000),
  termMonths: z.number().int().min(6).max(96),
  demoScenario: z.enum(["normal", "aurora-unavailable"]).default("normal")
});

export type SimulationPayload = z.infer<typeof simulationSchema>;

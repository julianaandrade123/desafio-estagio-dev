import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowRight, BadgeCheck, Building2, CheckCircle2, CircleAlert, Clock3, FileCheck2, Landmark, LoaderCircle, ShieldCheck, WalletCards } from "lucide-react";

type BankResult = {
  bank: string;
  status: "approved" | "rejected" | "unavailable";
  interestRateMonthly?: number;
  monthlyPayment?: number;
  approvedAmount?: number;
  reason?: string;
  message?: string;
};
type SimulationResponse = {
  simulationId: string;
  createdAt: string;
  results: BankResult[];
  disclaimer: string;
};

const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const statusLabel = (status: BankResult["status"]) => ({
  approved: "Pré-aprovado (simulado)",
  rejected: "Não aprovado",
  unavailable: "Indisponível"
}[status]);

export default function App() {
  const [form, setForm] = useState({
    name: "", email: "", cpf: "", salary: "4500",
    employerCnpj: "", requestedAmount: "12000",
    termMonths: "24", demoScenario: "normal"
  });
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setFieldErrors({});
    const payload = {
      ...form,
      salary: Number(form.salary),
      requestedAmount: Number(form.requestedAmount),
      termMonths: Number(form.termMonths)
    };

    try {
      const response = await fetch("http://localhost:3001/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        const errors: Record<string, string> = {};
        for (const item of data.details ?? []) errors[item.field] = item.message;
        setFieldErrors(errors);
        throw new Error(data.error ?? "Não foi possível realizar a simulação.");
      }
      setResult(data as SimulationResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível conectar à API. Verifique se o backend está em execução.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Consigna início">
          <span className="brand-mark"><WalletCards size={21} /></span>
          <span>consigna<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right"><span className="demo-pill"><span /> Ambiente de demonstração</span></div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> CRÉDITO COM MAIS CLAREZA</div>
            <h1>Compare possibilidades.<br /><span>Escolha com confiança.</span></h1>
            <p>Preencha seus dados e veja, em um só lugar, como diferentes instituições fictícias responderiam à sua simulação.</p>
            <div className="hero-points">
              <span><ShieldCheck size={17} /> Seus dados ficam nesta demonstração</span>
              <span><Clock3 size={17} /> Respostas em poucos segundos</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle circle-one" />
            <div className="art-circle circle-two" />
            <div className="art-card art-card-back"><span className="art-mini-icon"><Landmark size={18}/></span><span className="art-line long" /><span className="art-line short" /></div>
            <div className="art-card art-card-front">
              <div className="art-card-head"><span className="art-mini-icon"><WalletCards size={20}/></span><span className="art-tag">SIMULAÇÃO</span></div>
              <div className="art-amount">R$ 12.000,00</div><div className="art-muted">Valor solicitado</div>
              <div className="art-divider" /><div className="art-bottom"><span>Possibilidades</span><span className="art-check"><CheckCircle2 size={16}/> 2 bancos</span></div>
            </div>
            <div className="floating-badge"><span><BadgeCheck size={18}/></span><div><strong>Mais clareza</strong><small>Decisões lado a lado</small></div></div>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-panel panel">
            <div className="section-heading">
              <div className="section-icon"><FileCheck2 size={20}/></div>
              <div><span className="section-kicker">ETAPA 01</span><h2>Seus dados para simulação</h2><p>Todos os campos são necessários para esta demonstração.</p></div>
            </div>
            <form onSubmit={submit} noValidate>
              <div className="form-section-title">DADOS PESSOAIS</div>
              <div className="field">
                <label htmlFor="name">Nome completo</label>
                <input id="name" autoComplete="name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Ex.: Pessoa Exemplo" />
                {fieldErrors.name && <small className="field-error">{fieldErrors.name}</small>}
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="voce@exemplo.com" />
                {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="cpf">CPF fictício</label>
                  <input id="cpf" inputMode="numeric" value={form.cpf} onChange={e => update("cpf", e.target.value)} placeholder="000.000.000-00" />
                  {fieldErrors.cpf && <small className="field-error">{fieldErrors.cpf}</small>}
                </div>
                <div className="field">
                  <label htmlFor="employerCnpj">CNPJ do empregador</label>
                  <input id="employerCnpj" inputMode="numeric" value={form.employerCnpj} onChange={e => update("employerCnpj", e.target.value)} placeholder="00.000.000/0000-00" />
                  {fieldErrors.employerCnpj && <small className="field-error">{fieldErrors.employerCnpj}</small>}
                </div>
              </div>

              <div className="form-section-title section-spaced">DADOS DA SIMULAÇÃO</div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="salary">Salário mensal (R$)</label>
                  <div className="input-prefix"><span>R$</span><input id="salary" type="number" min="1" step="0.01" value={form.salary} onChange={e => update("salary", e.target.value)} /></div>
                  {fieldErrors.salary && <small className="field-error">{fieldErrors.salary}</small>}
                </div>
                <div className="field">
                  <label htmlFor="requestedAmount">Valor desejado (R$)</label>
                  <div className="input-prefix"><span>R$</span><input id="requestedAmount" type="number" min="1" step="0.01" value={form.requestedAmount} onChange={e => update("requestedAmount", e.target.value)} /></div>
                  {fieldErrors.requestedAmount && <small className="field-error">{fieldErrors.requestedAmount}</small>}
                </div>
              </div>
              <div className="field">
                <label htmlFor="termMonths">Prazo para pagamento</label>
                <select id="termMonths" value={form.termMonths} onChange={e => update("termMonths", e.target.value)}>
                  <option value="6">6 meses</option><option value="12">12 meses</option><option value="24">24 meses</option><option value="36">36 meses</option><option value="48">48 meses</option><option value="60">60 meses</option><option value="72">72 meses</option><option value="84">84 meses</option><option value="96">96 meses</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="demoScenario">Cenário técnico (para demonstração)</label>
                <select id="demoScenario" value={form.demoScenario} onChange={e => update("demoScenario", e.target.value)}>
                  <option value="normal">Consulta normal — dois bancos</option>
                  <option value="aurora-unavailable">Simular indisponibilidade do Banco Aurora</option>
                </select>
                <small className="field-hint">Este controle serve para demonstrar tolerância a falhas; não existe em uma operação bancária real.</small>
              </div>
              <div className="privacy-note"><ShieldCheck size={18}/><span>Use somente dados fictícios. Esta aplicação não consulta bancos reais nem oferece crédito.</span></div>
              {error && <div className="error-banner" role="alert"><CircleAlert size={18}/><span>{error}</span></div>}
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? <><LoaderCircle className="spin" size={18}/> Consultando instituições...</> : <>Simular empréstimo <ArrowRight size={18}/></>}
              </button>
            </form>
          </div>

          <aside className="side-column">
            <div className="side-card side-intro">
              <div className="side-icon"><Building2 size={20}/></div>
              <h3>Uma solicitação.<br/>Diferentes perspectivas.</h3>
              <p>As respostas são simuladas de forma independente para mostrar como a aplicação lida com contratos bancários diferentes.</p>
              <div className="bank-logos"><span><Landmark size={16}/> Aurora</span><span><Landmark size={16}/> Horizonte</span></div>
            </div>
            <div className="side-card process-card">
              <h3>Como funciona</h3>
              <div className="process-step"><span className="step-number">1</span><div><strong>Você informa os dados</strong><small>Validamos os campos antes de enviar.</small></div></div>
              <div className="process-connector"><ArrowDownRight size={16}/></div>
              <div className="process-step"><span className="step-number">2</span><div><strong>Consultamos os simuladores</strong><small>Cada banco tem sua própria resposta.</small></div></div>
              <div className="process-connector"><ArrowDownRight size={16}/></div>
              <div className="process-step"><span className="step-number">3</span><div><strong>Você compara os resultados</strong><small>Falha técnica não é reprovação.</small></div></div>
            </div>
            <div className="side-card assurance-card"><div className="assurance-icon"><ShieldCheck size={19}/></div><div><strong>Transparência em primeiro lugar</strong><p>Resultados fictícios, sem consulta de crédito ou compromisso financeiro.</p></div></div>
          </aside>
        </section>

        {result && <section className="results-section" aria-live="polite">
          <div className="results-header"><div><span className="section-kicker">ETAPA 02</span><h2>Resultado da sua simulação</h2><p>Confira a resposta de cada instituição, individualmente.</p></div><div className="result-id">ID <code>{result.simulationId.slice(0, 8).toUpperCase()}</code></div></div>
          <div className="result-cards">
            {result.results.map((bank) => <article className={`result-card ${bank.status}`} key={bank.bank}>
              <div className="result-card-top"><span className="bank-icon"><Landmark size={21}/></span><span className={`status-chip ${bank.status}`}>{bank.status === "approved" ? <CheckCircle2 size={14}/> : bank.status === "rejected" ? <CircleAlert size={14}/> : <Clock3 size={14}/>} {statusLabel(bank.status)}</span></div>
              <h3>{bank.bank}</h3>
              <p className="result-explainer">{bank.status === "approved" ? "Esta instituição retornou uma condição demonstrativa." : bank.status === "rejected" ? "A instituição não aprovou nos critérios fictícios." : "A consulta não foi concluída desta vez."}</p>
              {bank.status === "approved" ? <div className="finance-details">
                <div><span>Parcela estimada</span><strong>{currency(bank.monthlyPayment ?? 0)}<small>/mês</small></strong></div>
                <div className="finance-sub"><span>Taxa mensal</span><strong>{((bank.interestRateMonthly ?? 0) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%</strong></div>
                <div className="finance-sub"><span>Valor aprovado (simulado)</span><strong>{currency(bank.approvedAmount ?? 0)}</strong></div>
              </div> : <div className="result-reason"><span>{bank.status === "unavailable" ? "O que aconteceu" : "Motivo informado"}</span><p>{bank.status === "unavailable" ? bank.message : bank.reason}</p></div>}
              {bank.status === "unavailable" && <div className="unavailable-tip">Você ainda pode consultar os resultados das outras instituições.</div>}
            </article>)}
          </div>
          <div className="disclaimer"><ShieldCheck size={18}/><span>{result.disclaimer}</span></div>
          <div className="results-footer"><span>Simulação criada em {new Date(result.createdAt).toLocaleString("pt-BR")}</span><button className="secondary-button" onClick={() => {setResult(null); window.scrollTo({top:0,behavior:"smooth"});}}>Nova simulação</button></div>
        </section>}
      </main>
      <footer><span className="footer-brand"><WalletCards size={17}/> consigna.</span><span>MVP técnico · Dados fictícios · Sem oferta real de crédito</span></footer>
    </div>
  );
}

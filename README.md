# Consigna — Simulador de Empréstimo Consignado

## 1. Sobre o projeto

O Consigna é uma aplicação desenvolvida como parte de um desafio técnico para estágio em desenvolvimento de software. O objetivo é simular propostas de empréstimo consignado e comparar resultados retornados por diferentes instituições financeiras fictícias.

A aplicação permite informar dados do solicitante, consultar simuladores bancários independentes e visualizar os resultados consolidados em uma única interface.

## 2. Funcionalidades

- Coleta dos dados necessários para a simulação.
- Validação dos dados informados pelo usuário.
- Simulação de propostas por duas instituições financeiras fictícias.
- Representação de cenários de aprovação e reprovação.
- Normalização e consolidação dos resultados bancários.
- Exibição dos resultados na interface.
- Tratamento de falhas nas consultas às instituições, quando aplicável.

> **Aviso:** os bancos e os resultados são fictícios. A aplicação não realiza consultas financeiras reais nem solicitações efetivas de empréstimo.

## 3. Tecnologias utilizadas

- **TypeScript:** tipagem estática e organização do código.
- **React:** construção da interface.
- **Vite:** ambiente de desenvolvimento e compilação do frontend.
- **Node.js:** ambiente de execução do backend.
- **Express:** implementação da API HTTP, caso utilizado no backend.
- **Vitest:** testes automatizados, caso configurado no projeto.

## 4. Arquitetura

O projeto está organizado em duas partes principais:

### Frontend

Responsável pela interface, coleta dos dados do solicitante, envio das solicitações de simulação e apresentação dos resultados.

### Backend

Responsável pela API, validação dos dados, execução das simulações, comunicação com os adaptadores bancários fictícios e consolidação das respostas.

### Adaptadores bancários

Cada instituição possui um adaptador próprio, permitindo separar as regras de simulação e facilitar a inclusão de novas instituições no futuro.

### Normalização dos resultados

Os resultados retornados pelos adaptadores são convertidos para um formato comum, facilitando a comparação entre as instituições.

## 5. Estrutura do projeto

```text
.
├── backend/
│   └── src/
│       ├── integrations/
│       ├── schemas/
│       ├── services/
│       ├── app.ts
│       ├── server.ts
│       └── types.ts
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── styles.css
├── .gitignore
├── package.json
└── README.md
```

## 6. Como executar o projeto

### Pré-requisitos

- Node.js em uma versão compatível com o projeto.
- npm.

### Instalação

Na raiz do projeto, execute:

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

### Compilação

```bash
npm run build
```

### Testes

```bash
npm test
```

Os comandos acima são definidos no `package.json` da raiz. A execução depende de as dependências estarem instaladas e os scripts configurados corretamente.

## 7. Decisões técnicas

- **Separação entre frontend e backend:** facilita a manutenção e permite evoluir cada parte de forma independente.
- **Adaptadores por instituição:** isolam o comportamento específico de cada banco e reduzem o acoplamento.
- **Tipos compartilhados:** ajudam a manter a consistência dos dados trocados entre os componentes do sistema.
- **Normalização das respostas:** permite comparar instituições mesmo quando suas implementações internas são diferentes.
- **Validação de entrada:** reduz a possibilidade de processar dados inválidos.
- **Testes automatizados:** ajudam a verificar comportamentos importantes e prevenir regressões.

## 8. Limitações conhecidas

- As instituições financeiras são simuladas e não utilizam APIs reais.
- Os critérios de aprovação são fictícios e não representam políticas de crédito reais.
- A aplicação não efetiva contratos nem realiza operações financeiras.
- O comportamento de disponibilidade parcial depende da implementação de tratamento de falhas no backend.

## 9. Melhorias implementadas

### Problema: respostas bancárias em formatos diferentes

**Proposta:** normalizar as respostas em uma estrutura comum.

**Por quê:** facilita a consolidação e a comparação dos resultados.

### Problema: dependência de instituições específicas

**Proposta:** separar a integração de cada instituição em um adaptador.

**Por quê:** permite adicionar ou substituir instituições com menor impacto no restante da aplicação.

## 10. Melhorias planejadas

### Prioridade alta — Persistência das simulações

**Problema:** os resultados podem não ser mantidos após o encerramento da sessão.

**Proposta:** adicionar persistência em banco de dados.

**Por quê:** permitiria consultar o histórico de simulações e acompanhar sua evolução.

### Prioridade alta — Segurança e proteção de dados

**Problema:** dados como CPF e salário exigem proteção adequada.

**Proposta:** implementar controles de acesso, minimização de dados, proteção de informações sensíveis e políticas de retenção.

**Por quê:** reduzir riscos de exposição e preparar a aplicação para um cenário real.

### Prioridade média — Integração com serviços externos

**Problema:** os resultados são gerados por regras fictícias.

**Proposta:** criar uma camada de integração configurável para conectar APIs de instituições autorizadas.

**Por quê:** aproximar a aplicação de um cenário real sem acoplar o sistema a um único fornecedor.

### Prioridade média — Observabilidade

**Problema:** pode ser difícil identificar falhas durante as simulações.

**Proposta:** adicionar logs estruturados, métricas e rastreamento das solicitações.

**Por quê:** facilitar diagnóstico e monitoramento.

### Prioridade baixa — Ampliação da cobertura de testes

**Problema:** testes limitados podem deixar comportamentos importantes sem verificação.

**Proposta:** ampliar os testes unitários e de integração, incluindo entradas inválidas, falhas parciais e cenários de aprovação e reprovação.

**Por quê:** aumentar a confiabilidade e facilitar futuras alterações.

## 11. Considerações finais

O projeto demonstra uma abordagem modular para simulação e consolidação de propostas de empréstimo consignado. A separação entre interface, API, adaptadores e normalização dos resultados busca facilitar a manutenção, os testes e a evolução da aplicação.
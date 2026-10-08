# .opencode — instruções, agentes e skills

Pasta central de **rules** (instruções carregadas via `opencode.json › instructions`), **agents** (subagentes `mode: subagent`, invocáveis com `@nome`), **commands** (comandos de barra `/nome`) e **skills** (conhecimento carregado sob demanda via `skill` tool).

> Migrado de `.claude/`. A pasta `.claude/` foi mantida como referência; a fonte de verdade agora é `.opencode/`. Detalhes da conversão em `MIGRACAO.md`.

## Estrutura interna de `.opencode/`

```
.opencode/
├── agents/                   # 6 subagentes do ciclo de desenvolvimento (mode: subagent)
│   ├── agente-requisitos.md
│   ├── agente-backend.md
│   ├── agente-frontend.md
│   ├── agente-testes.md
│   ├── agente-code-review.md
│   └── agente-qualidade.md
├── commands/                 # comandos de barra (/nome)
│   ├── nova-funcionalidade.md   # orquestrador do fluxo completo
│   ├── consertar.md             # requisito + diagnóstico + correção + dupla revisão de código + testes, via agentes especializados
│   ├── revisao-codigo.md        # revisão de código avulsa via agente-code-review
│   └── checklist-qualidade.md   # checklist avulsa via agente-qualidade
├── rules/
│   ├── general/              # GENERAL.* — valem para todo projeto (via opencode.json › instructions)
│   ├── frontend/             # FRONTEND.* — React, MUI, styled-components, design system
│   ├── backend/              # BACKEND.* — Supabase, SQL, testes de banco
│   └── mcp/                  # MCP.* — como usar cada servidor MCP
├── skills/                   # uma pasta por skill — .opencode/skills/<nome>/SKILL.md
│   ├── ciclo-desenvolvimento/  # modo sem subagentes
│   ├── react-*, material-ui-*, supabase-*, ...  # skills React/MUI/Supabase client/LGPD/SEO…
│   └── ...                   # skills importadas (mattpocock/skills, supabase/agent-skills) — ver rules/backend/skills-lock.json
├── assets/
│   └── frontend/             # tema e componentes corporativos de referência (copiar, não importar)
```

`opencode.json` (na raiz do projeto) declara `instructions` (as rules acima), `permission` (`skill`/`question: allow`) e o espaço para `mcp` por projeto. `AGENTS.md` (raiz) é o índice de projeto carregado automaticamente.

## Fluxo de desenvolvimento por agentes

```
usuário ──► /nova-funcionalidade "<pedido>"
                │
                ▼
   1. @agente-requisitos ── entrevista (1 pergunta por vez, via question tool) ──► 00-spec.md ──► aprovação humana
                │
                ▼
   2. @agente-backend ──── migrations, fn_/tr_/vw_/RLS, types, services, pgTAP ──► 01-backend.md
                │
                ▼
   3. @agente-frontend ─── Container/Hook/View, rotas, menu, a11y, responsivo ──► 02-frontend.md
                │
                ▼
   4. @agente-testes ───── unitários + integração + pgTAP + E2E, matriz critério→teste ──► 03, 04
                │
                ▼
   5. @agente-code-review ─ bugs, segurança, legibilidade, performance, manutenibilidade ──► 05-code-review.md
                │                          │
        SEM BLOQUEIO                 BLOQUEADO ──► devolve ao agente responsável (conta no limite de 3 ciclos)
                │
                ▼
   6. @agente-qualidade ── checklist completa + revisão 2 eixos ──► 06-checklist-qualidade.md
                │                          │
          APROVADO                    REPROVADO ──► devolve ao agente responsável (máx. 3 ciclos)
                │
                ▼
   7. orquestrador ────── mensagem de commit ──► "Posso realizar o commit?" ──► commit (sem push)
```

### Responsabilidade de cada agente

| Agente | Faz | Não faz | Skills que carrega (via `skill` tool) |
|---|---|---|---|
| `agente-requisitos` | explora código e schema real, entrevista o stakeholder, escreve spec com critérios Dado/Quando/Então, spec técnica back/front e matriz de rastreabilidade, obtém aprovação (também usado por `/consertar`, em modo correção abreviado) | código, perguntas respondíveis pelo código | analise-requisitos, grill-with-docs, domain-modeling |
| `agente-backend` | migrations, functions/triggers/views/RLS/índices, Edge Functions, types gerados, services RPC, pgTAP mínimo | lógica de negócio em TS, migration remota sem confirmação, UI | supabase-metodologia, supabase-convencoes, supabase-postgres-best-practices, supabase-type-gen, tdd, domain-modeling |
| `agente-frontend` | telas em 3 camadas, rotas/menu, estados loading/vazio/erro, a11y, responsividade, teste de renderização da View | regra de negócio, chamar supabase fora de service, migrations | react-*, material-ui-*, ui-ux-design-system, context-*, adicionar-item-menu, javascript-async-errors |
| `agente-testes` | matriz critério→teste, unitários (RTL/Vitest/pgTAP/Deno), integração (MSW, Supabase local), E2E Playwright, execução e saída real | implementar feature, "ajustar" teste para passar, dados reais em fixtures | react-vitest-test-enforcer, tdd, testes-playwright, diagnosing-bugs |
| `agente-code-review` | revisa o diff em 6 dimensões (bugs, segurança, legibilidade, performance, boas práticas, manutenibilidade), achados por severidade | corrigir código, rodar checklist/advisors/a11y/cobertura, repetir os eixos Padrões×Spec | diagnosing-bugs, react-boas-praticas, react-convencoes, supabase-postgres-best-practices, lgpd-brasil |
| `agente-qualidade` | reexecuta comandos, checklist de 9 seções, revisão Padrões × Spec, LGPD, advisors, EXPLAIN, a11y, riscos, veredito | editar qualquer código, aprovar com ressalvas, refazer a revisão do `agente-code-review` | code-review, verificar-acessibilidade, lgpd-brasil, improve-codebase-architecture-relatorio-html, supabase-postgres-best-practices |

### Stack assumida

Supabase database-first (Postgres functions/triggers/views/RLS, Edge Functions em Deno) + React/TypeScript/Material UI + Vitest/RTL/MSW + pgTAP + Playwright. Deploy via Netlify (`skills/frontend/operacoes-netlify`). Detalhes de teste por camada em `rules/backend/BACKEND.Testes.instructions.md`.

## Tutorial: como usar no dia a dia

### 1. Desenvolver uma funcionalidade nova (fluxo completo)

No opencode, na raiz do projeto (com `.opencode/` instalado):

```
/nova-funcionalidade "Cadastro de fornecedores com CNPJ único e aprovação por gestor"
```

O que acontece, na ordem:

1. **`@agente-requisitos` entrevista você, uma pergunta por vez** (via `question` tool). Responda como faria em uma conversa normal. O agente continua até ter regras de negócio, permissões, dados e critérios de aceitação Dado/Quando/Então suficientes, e então mostra o `00-spec.md` completo.
2. **Você aprova a spec** (ou pede ajuste). Só depois disso qualquer código é escrito.
3. **A partir daqui o fluxo roda sozinho, sem novas perguntas** (salvo os pontos de parada abaixo): `@agente-backend` cria migrations/functions/RLS/services → `@agente-frontend` cria as telas → `@agente-testes` escreve e roda a suíte → `@agente-code-review` revisa → `@agente-qualidade` dá o veredito.
4. **Pontos em que o processo para e pergunta:**
   - Antes de aplicar uma migration em banco **remoto** (em banco local a aplicação é automática).
   - Se `@agente-code-review` ficar `BLOQUEADO` ou `@agente-qualidade` reprovar 3 vezes seguidas — aí ele mostra os achados pendentes e pergunta como prosseguir.
   - Antes do commit.
5. **Ao final**, resumo curto + pergunta `Posso realizar o commit dessas alterações?`. O `git push` nunca é automático.

### 2. Consertar um bug (diagnóstico + correção)

```
/consertar "Ao aprovar um fornecedor duplicado, o status fica 'ativo' mas o e-mail de notificação não é enviado"
/consertar docs/bugs/relatorio-erro-login.md
```

`/consertar` passa pelo `@agente-requisitos` em modo correção (entrevista abreviada, 0–3 perguntas) antes de qualquer correção, depois `@agente-backend`/`@agente-frontend`, `@agente-code-review` (revisão inicial), `@agente-testes` (regressão + suíte), `@agente-code-review` (revisão final), `@agente-qualidade`, e pede aprovação antes do commit (`fix(<escopo>): ...`), sem `git push` automático.

### 3. Checklist / revisão avulsas

```
/checklist-qualidade
/checklist-qualidade main
/revisao-codigo
/revisao-codigo main docs/evidencias/2026-09-10-cadastro-fornecedores
```

Mesma semântica do `.claude/`: primeiro argumento = ponto fixo do diff, segundo = pasta de evidências opcional. Só avaliam — não corrigem nem commitam.

### 4. Sem subagentes

```
Use a skill ciclo-desenvolvimento para desenvolver: "Cadastro de fornecedores com CNPJ único"
```

O agente assume os seis papéis em sequência, lendo os arquivos de `agents/` como roteiro, e gera as mesmas evidências em `docs/evidencias/<feature>/`.

### 5. Onde ficam os resultados

Toda funcionalidade deixa rastro completo em `docs/evidencias/<slug>/` (`STATUS.md`, `00-spec.md`, `01-backend.md`, `02-frontend.md`, `03/04-testes-*.md`, `05-code-review.md`, `06-checklist-qualidade.md`, `07-commit.md`). `/consertar` usa os nomes próprios (`00-diagnostico.md`, `02-code-review-inicial.md`, `05-code-review-final.md`). Detalhes em `GENERAL.Evidencias.instructions.md`.

## Rules

| Pasta | Arquivo | Para quê |
|---|---|---|
| general | GENERAL.Index | como criar/manter instruções |
| general | GENERAL.FluxoAgentes | regras do ciclo de agentes, pontos de parada, formato de resultado |
| general | GENERAL.Evidencias | estrutura de `docs/evidencias/<feature>/` |
| general | GENERAL.ChecklistDeQualidade | checklist de 9 seções com itens bloqueantes (carregada só pelo agente-qualidade) |
| general | GENERAL.Diretrizes | Karpathy + qualidade de código (dentro do fluxo, parcialmente substituída por FluxoAgentes) |
| general | GENERAL.AnaliseRequisito | template de história de usuário |
| general | GENERAL.Changelog | Keep a Changelog |
| general | GENERAL.GuiaDocumentacao | docs/, prompts/, JSDoc de cabeçalho |
| general | GENERAL.ReactSegurancaLogsLGPD | PII, logs, storage, segredos |
| general | GENERAL.react-vitest-test-enforcer | testes obrigatórios no frontend |
| general | GENERAL.DiretrizesRegrasGovernancaGit | aprovação explícita para commit, Conventional Commits pt-BR |
| general | revisao_codigo_automatizada | formato de comentários de revisão |
| frontend | FRONTEND.React.BoasPraticas / Nomenclatura / StyledComponents / UIUXDesignSystem | padrões React e design system |
| backend | BACKEND.Supabase.Nomenclatura | nomes pt-BR, prefixos fn_/tr_/vw_/idx_… |
| backend | BACKEND.Testes | pgTAP, Deno test, Vitest+MSW, integração local |
| backend | BACKEND.sql-postgres | estilo SQL |
| mcp | MCP.Supabase / Playwright / MaterialUI / RefTools | uso de cada servidor MCP |

## Skills

`skills/` contém as skills autorais do workspace (React, MUI, Supabase client, LGPD, SEO, Netlify, Notion, APIs públicas BR) e skills importadas versionadas por hash em `rules/backend/skills-lock.json` — não edite; atualize pela origem (`mattpocock/skills`, `supabase/agent-skills`). `general/ciclo-desenvolvimento` não existe aqui — `ciclo-desenvolvimento` fica na raiz de `skills/`.

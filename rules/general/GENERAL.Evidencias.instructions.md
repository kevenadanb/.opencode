# Registro Automático de Evidências

Toda funcionalidade desenvolvida pelo fluxo de agentes deixa um rastro verificável em `docs/evidencias/<feature>/` no repositório do projeto. A pasta é versionada junto com o código e é a fonte de verdade sobre o que foi especificado, implementado, testado e validado.

## Nome da pasta

`<feature>` é um slug em kebab-case derivado do nome da história de usuário, prefixado pela data de início: `docs/evidencias/2026-09-14-exportar-relatorio-vendas/`. O orquestrador cria a pasta e o `STATUS.md` antes de chamar o primeiro agente.

## Arquivos e responsáveis

| Arquivo | Escrito por | Conteúdo mínimo |
|---|---|---|
| `STATUS.md` | orquestrador (atualizado a cada etapa) | tabela etapa × agente × status × data/hora × evidência; ciclo de correção atual |
| `00-spec.md` | agente-requisitos | história de usuário completa no template de `GENERAL.AnaliseRequisito`, decisões da entrevista, suposições, aprovação do usuário (data/hora) |
| `01-backend.md` | agente-backend | objetos de banco criados/alterados (tabelas, functions, triggers, views, policies) com SQL final; services/RPC expostos; types regenerados; decisões arquiteturais |
| `02-frontend.md` | agente-frontend | telas/componentes/hooks criados; rotas e itens de menu; contratos consumidos do backend; checklist de acessibilidade e responsividade |
| `03-testes-unitarios.md` | agente-testes | lista de arquivos de teste, cenários cobertos (feliz, vazio, inválido, erro, borda), **saída real** do comando de execução, cobertura por arquivo |
| `04-testes-integracao.md` | agente-testes | fluxos integrados cobertos, mocks/MSW e fixtures usados, **saída real** do comando, testes E2E Playwright quando aplicáveis |
| `05-code-review.md` | agente-code-review | achados de bugs, segurança, legibilidade, performance, boas práticas e manutenibilidade por severidade (alta/média/baixa), veredito SEM BLOQUEIO/BLOQUEADO |
| `06-checklist-qualidade.md` | agente-qualidade | cada item da `GENERAL.ChecklistDeQualidade` com ✅/❌/N/A, saída dos comandos, riscos técnicos, veredito final |
| `07-commit.md` | orquestrador | mensagem de commit sugerida, hash após aprovação, arquivos incluídos |

## Regras de escrita

- **Saída real, não descrição.** Onde a tabela pede "saída do comando", colar o trecho relevante do terminal (resumo do Vitest, `pg_prove`, `npm run type-check`), dentro de bloco de código, com o comando executado na primeira linha.
- **Data e hora em cada seção** (`YYYY-MM-DD HH:mm`, fuso do projeto).
- **Nunca sobrescrever histórico de reprovação.** Em ciclo de correção, acrescentar uma seção `## Ciclo N` ao final do arquivo, mantendo as anteriores.
- **Sem dados sensíveis.** Saídas de teste e amostras de dados seguem `GENERAL.ReactSegurancaLogsLGPD`: mascarar PII, nunca colar tokens ou connection strings.
- **Links relativos** para os arquivos de código citados (`../../src/...`), não caminhos absolutos da máquina.

## Template do STATUS.md

```markdown
# <Nome da funcionalidade>

Início: YYYY-MM-DD HH:mm · Ciclo de correção: 0/3

| # | Etapa | Agente | Status | Atualizado | Evidência |
|---|---|---|---|---|---|
| 1 | Requisitos | agente-requisitos | ⏳ pendente / 🔄 em curso / ✅ concluído / ❌ reprovado / ⛔ bloqueado | | 00-spec.md |
| 2 | Backend | agente-backend | | | 01-backend.md |
| 3 | Frontend | agente-frontend | | | 02-frontend.md |
| 4 | Testes | agente-testes | | | 03-testes-unitarios.md, 04-testes-integracao.md |
| 5 | Revisão de código | agente-code-review | | | 05-code-review.md |
| 6 | Qualidade | agente-qualidade | | | 06-checklist-qualidade.md |
| 7 | Commit | orquestrador | | | 07-commit.md |

## Delegações
- (nenhuma)

## Bloqueios
- (nenhum)
```

## Evidências específicas do `/consertar`

O fluxo de correção de bug (`/consertar`) usa a mesma pasta e o mesmo `STATUS.md`, mas com arquivos próprios, porque a revisão de código roda duas vezes:

| Arquivo | Escrito por | Conteúdo mínimo |
|---|---|---|
| `00-diagnostico.md` | orquestrador | relato original, passos de reprodução, causa raiz com evidência, escopo da correção, spec relacionada encontrada (se houver) |
| `00-spec.md` | agente-requisitos | spec da correção (nova, restrita ao bug) ou um resumo curto com link para o `## Adendo N` gravado na `00-spec.md` da funcionalidade relacionada |
| `01-backend.md` / `01-frontend.md` | agente-backend / agente-frontend | mesmo conteúdo mínimo da tabela acima, restrito à correção |
| `02-code-review-inicial.md` | agente-code-review | achados e veredito da primeira passagem, antes dos testes |
| `03-testes-unitarios.md`, `04-testes-integracao.md` | agente-testes | mesmo conteúdo mínimo da tabela acima; `04` registra "N/A" com justificativa quando não há integração aplicável |
| `05-code-review-final.md` | agente-code-review | achados e veredito da segunda passagem, depois dos testes |
| `06-checklist-qualidade.md` | agente-qualidade | mesmo conteúdo mínimo da tabela acima |
| `07-commit.md` | orquestrador | mesmo conteúdo mínimo da tabela acima |

## Definição de "concluído"

Uma funcionalidade só é considerada concluída quando `STATUS.md` mostra as etapas 1 a 6 como ✅, `05-code-review.md` termina com `VEREDITO: SEM BLOQUEIO` e `06-checklist-qualidade.md` termina com `VEREDITO: APROVADO`. A etapa 7 depende da aprovação humana do commit.

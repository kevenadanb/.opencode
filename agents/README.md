# Agentes Especializados

Conjunto de 6 subagentes do Claude Code para o ciclo completo de desenvolvimento. Detalhes completos (fluxo, regras, tutorial) em `../README.md` e `../rules/general/GENERAL.FluxoAgentes.instructions.md` — este arquivo é só um índice rápido.

## Agentes

| Agente | Arquivo | Responsabilidade principal |
|---|---|---|
| **agente-requisitos** | `agente-requisitos.md` | Entrevista o stakeholder, escreve `docs/evidencias/<feature>/00-spec.md` com história de usuário, regras de negócio e critérios Dado/Quando/Então; também usado por `/consertar`, em modo correção abreviado |
| **agente-backend** | `agente-backend.md` | Migrations, functions/triggers/views/RLS, Edge Functions, types, services RPC, pgTAP mínimo |
| **agente-frontend** | `agente-frontend.md` | Telas, hooks e componentes em 3 camadas, rotas/menu, acessibilidade e responsividade |
| **agente-testes** | `agente-testes.md` | Testes unitários e de integração (Vitest/RTL, pgTAP, Deno, MSW, Playwright E2E), rastreabilidade critério → teste |
| **agente-code-review** | `agente-code-review.md` | Revisão de código em 6 dimensões (bugs, segurança, legibilidade, performance, boas práticas, manutenibilidade) e veredito `SEM BLOQUEIO`/`BLOQUEADO` |
| **agente-qualidade** | `agente-qualidade.md` | Checklist de qualidade completa e veredito final `APROVADO`/`REPROVADO` |

## Fluxo

```
agente-requisitos ──► agente-backend ──► agente-frontend ──► agente-testes ──► agente-code-review ──► agente-qualidade
       │                    │                   │                  │                  │                     │
  00-spec.md          01-backend.md      02-frontend.md    03/04-testes-*.md   05-code-review.md   06-checklist-qualidade.md
```

Orquestrado pelo comando `/nova-funcionalidade` (`../commands/nova-funcionalidade.md`). `/consertar` (`../commands/consertar.md`) reaproveita o `agente-requisitos` em modo correção antes de `agente-backend`/`agente-frontend`, e roda `agente-code-review` duas vezes — antes e depois dos testes. Checklist avulsa, sem rodar o fluxo inteiro: `/checklist-qualidade`. Sem subagentes (Claude Cowork): skill `ciclo-desenvolvimento`.

## Skills por agente

Ver o frontmatter `skills:` de cada `agente-*.md` — é a fonte de verdade. Resumo em `../README.md#responsabilidade-de-cada-agente`.

## Regras obrigatórias

Definidas em `../rules/general/GENERAL.FluxoAgentes.instructions.md`: toda funcionalidade tem testes unitários; toda integração tem testes de integração; nada é finalizado sem a revisão de código e a checklist de qualidade; evidências gravadas automaticamente em `docs/evidencias/<feature>/`; um agente delega para outro por meio do orquestrador, nunca diretamente.

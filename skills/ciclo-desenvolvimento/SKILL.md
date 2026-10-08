---
name: ciclo-desenvolvimento
description: Executa o ciclo completo de desenvolvimento de uma funcionalidade (requisitos → backend → frontend → testes → revisão de código → qualidade) assumindo sequencialmente os papéis dos 6 agentes especializados do workspace. Use no Claude Cowork ou em qualquer ambiente sem suporte a subagentes, quando o usuário pedir uma nova funcionalidade, "rodar o fluxo de agentes" ou "desenvolver de ponta a ponta". No opencode com subagentes prefira o comando /nova-funcionalidade.
---



# Ciclo de Desenvolvimento (modo sequencial)



Esta skill é o equivalente do comando `/nova-funcionalidade` para ambientes **sem subagentes** (Claude Cowork, sessões sem `.opencode/agents/`). Em vez de despachar subagentes, você **assume um papel por vez**, lendo o arquivo do agente correspondente e seguindo-o à risca, e registra tudo em `docs/evidencias/<feature>/`.



Leia primeiro:



- `.opencode/rules/general/GENERAL.FluxoAgentes.instructions.md` — regras obrigatórias, pontos de parada, formato de resultado

- `.opencode/rules/general/GENERAL.Evidencias.instructions.md` — estrutura da pasta de evidências



## Como executar



1. **Preparação** (papel: orquestrador) — siga o "Passo 0" de `.opencode/commands/nova-funcionalidade.md`: slug, pasta, `STATUS.md`, `Base: <hash>`, verificação de ambiente.

2. **Para cada etapa**, na ordem abaixo, abra o arquivo do agente, adote a persona, as regras e o processo descritos nele como se fosse a sua única tarefa, e termine com o bloco `## RESULTADO` dele. Atualize `STATUS.md` antes de passar ao próximo papel.



   | Etapa | Arquivo do papel | Evidência |

   |---|---|---|

   | 1 | `.opencode/agents/agente-requisitos.md` | `00-spec.md` (pausa: aprovação do usuário) |

   | 2 | `.opencode/agents/agente-backend.md` | `01-backend.md` |

   | 3 | `.opencode/agents/agente-frontend.md` | `02-frontend.md` |

   | 4 | `.opencode/agents/agente-testes.md` | `03-testes-unitarios.md`, `04-testes-integracao.md` |

   | 5 | `.opencode/agents/agente-code-review.md` | `05-code-review.md` |

   | 6 | `.opencode/agents/agente-qualidade.md` | `06-checklist-qualidade.md` |



3. **Delegações e ciclos de correção**: siga as seções homônimas de `nova-funcionalidade.md`, trocando de papel conforme o `Devolver para` / `DELEGAÇÃO`. Limite de 3 ciclos (contados em conjunto entre a revisão de código e a qualidade).

4. **Commit** (papel: orquestrador) — "Passo 7": proponha a mensagem, pergunte "Posso realizar o commit dessas alterações?" e aguarde. Nunca `git push`.



## Disciplina de troca de papel



- Ao trocar de papel, **releia o arquivo do agente**; não confie na memória do papel anterior.

- O papel atual só toca nos arquivos que o seu agente autoriza (ex.: no papel de Qualidade você não edita código, mesmo tendo acabado de escrevê-lo no papel de Frontend).

- Ferramentas MCP citadas no frontmatter `tools:` de cada agente são as que aquele papel pode usar; se uma não estiver disponível no ambiente, registre em `Pendências / riscos` e use a alternativa manual (ex.: `psql`/SQL via CLI em vez de `mcp__supabase__execute_sql`).

- O `AskUserQuestion` do Agente de Requisitos continua sendo **uma pergunta por vez**.



## Quando NÃO usar



- No Claude Code com `.opencode/agents/` configurado — use `/nova-funcionalidade`, que isola o contexto de cada agente.

- Para correções pontuais sem mudança de comportamento (use as skills específicas e `/checklist-qualidade`).


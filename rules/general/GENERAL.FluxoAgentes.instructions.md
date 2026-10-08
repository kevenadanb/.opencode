# Fluxo de Desenvolvimento Orientado por Agentes

Este workspace desenvolve funcionalidades através de **seis agentes especializados** que atuam em sequência, coordenados pelo comando `/nova-funcionalidade`. Cada agente tem um arquivo próprio em `.opencode/agents/` e só faz o que está descrito ali.

## Agentes

| Ordem | Agente | Arquivo | Entrega |
|---|---|---|---|
| 1 | Requisitos | `agents/agente-requisitos.md` | `docs/evidencias/<feature>/00-spec.md` |
| 2 | Backend | `agents/agente-backend.md` | migrations, functions, RLS, services + `01-backend.md` |
| 3 | Frontend | `agents/agente-frontend.md` | telas, hooks, componentes + `02-frontend.md` |
| 4 | Testes | `agents/agente-testes.md` | testes unitários e de integração + `03-testes-unitarios.md`, `04-testes-integracao.md` |
| 5 | Revisão de código | `agents/agente-code-review.md` | `05-code-review.md` — bugs, segurança, legibilidade, performance, boas práticas e manutenibilidade, com veredito SEM BLOQUEIO / BLOQUEADO |
| 6 | Qualidade | `agents/agente-qualidade.md` | `06-checklist-qualidade.md` com veredito APROVADO / REPROVADO |

## Regras obrigatórias (não negociáveis)

1. **Toda funcionalidade tem testes unitários.** Sem exceção justificada e registrada em evidência, a funcionalidade não está pronta.
2. **Toda integração tem testes de integração.** Vale para RPC ↔ service, service ↔ hook, hook ↔ componente e fluxo completo do usuário.
3. **Nenhum código é finalizado sem passar pela revisão de código** (`agente-code-review`) **e pela checklist de qualidade** (`GENERAL.ChecklistDeQualidade.instructions.md`, executada pelo Agente de Qualidade). Achado de severidade alta na revisão de código bloqueia a etapa 6 até ser corrigido.
4. **Toda implementação segue os padrões arquiteturais** do workspace: database-first no Supabase (`supabase-metodologia`), 3 camadas no React (`FRONTEND.React.Nomenclatura`), nomenclatura pt-BR no banco (`BACKEND.Supabase.Nomenclatura`).
5. **Evidências são registradas automaticamente** em `docs/evidencias/<feature>/` conforme `GENERAL.Evidencias.instructions.md`. Um agente que não gravou sua evidência não concluiu.
6. **O processo é automatizado.** Depois que a spec é aprovada, os agentes 2 a 6 rodam sem pausas para confirmação, exceto nos pontos de parada obrigatória abaixo.
7. **Um agente pode delegar para outro.** Delegação é feita por meio do orquestrador (subagentes não invocam subagentes): o agente registra um bloco `DELEGAÇÃO` no seu relatório final e o orquestrador despacha.

## Pontos de parada obrigatória (humano no circuito)

- **Após a spec** (agente 1): o usuário aprova o `00-spec.md` antes de qualquer código. Enquanto a entrevista está em curso, o Agente de Requisitos faz perguntas uma a uma.
- **Antes de aplicar migration em banco remoto**: o SQL é mostrado e confirmado (`MCP.Supabase.instructions.md`). Em banco local (`supabase start`) a aplicação é automática.
- **Antes do commit**: o orquestrador apresenta o resumo e a mensagem de commit sugerida e aguarda aprovação (`GENERAL.DiretrizesRegrasGovernancaGit.instructions.md`). Nunca há `git push` automático.

### Como a entrevista funciona na prática (limitação de subagente)

Subagentes invocados via Agent/Task **não têm acesso a `AskUserQuestion`**, mesmo quando declarada no `tools:` do frontmatter — confirmado em uso real. Por isso o `agente-requisitos` não fala com o usuário diretamente: ele e o orquestrador fazem um ping-pong de chamadas.

- O agente termina cada chamada da entrevista com `## PERGUNTA` (uma pergunta, com uma sugestão de resposta) — nunca mais de uma por chamada, nunca a resposta inventada.
- O orquestrador lê esse bloco, faz a pergunta ao usuário de verdade via `AskUserQuestion` (a sugestão do agente vira a primeira opção), e **retoma o mesmo agente** (mesma invocação, não uma nova) informando a resposta.
- Isso se repete até o agente emitir `## SPEC PARA APROVAÇÃO` — o orquestrador mostra o resumo ao usuário, pergunta Aprovar/Ajustar/Cancelar via `AskUserQuestion`, e retoma o agente com a decisão.
- Só depois disso o agente emite o bloco final `## RESULTADO`.

Essa é a única etapa do fluxo com esse padrão de pergunta/resposta — os demais agentes (2 a 6) não interagem com o usuário, só com o orquestrador.

## Ciclo de correção

Duas etapas podem devolver a feature para correção:

- **Agente de Revisão de Código (etapa 5) BLOQUEADO**: achado de severidade alta pendente. O orquestrador devolve para `agente-backend` e/ou `agente-frontend` conforme indicado, reexecuta o Agente de Testes e chama o Agente de Revisão de Código de novo antes de seguir para a Qualidade.
- **Agente de Qualidade (etapa 6) REPROVADO**: o orquestrador devolve os achados ao agente responsável (backend, frontend ou testes), que corrige e regrava a sua evidência. O Agente de Testes reexecuta a suíte e o Agente de Qualidade reavalia.

Limite: **3 ciclos**, contados em conjunto entre as duas etapas. No terceiro ciclo reprovado/bloqueado, o orquestrador interrompe e apresenta o relatório ao usuário para decisão.

## `/consertar` (fluxo de correção de bug)

`/consertar` reaproveita o mesmo `agente-requisitos` (ver seção acima), mas em modo correção: a entrevista é abreviada (0 a 3 perguntas, só se o diagnóstico já feito pelo orquestrador deixar dúvida real sobre o comportamento correto) e a spec resultante tanto pode ser um `00-spec.md` novo, restrito ao comportamento que corrige o bug, quanto um adendo (`## Adendo N — Correção`) numa `00-spec.md` já existente de uma funcionalidade relacionada. A ordem completa é:

```
orquestrador (diagnóstico) → agente-requisitos (requisito) → aprovação humana
   → agente-backend/agente-frontend (correção)
   → agente-code-review (revisão de código inicial)
   → agente-testes (unitários + integração, quando aplicável)
   → agente-code-review (revisão de código final)
   → agente-qualidade
   → orquestrador (commit, pausa humana)
```

A revisão de código roda **duas vezes**: antes dos testes (valida a correção em si) e depois (valida que os testes não introduziram problemas e que o resultado final está limpo). As duas passagens contam para o mesmo limite de 3 ciclos de correção da seção acima, junto com a etapa de testes e a de qualidade. Detalhes completos em `.opencode/commands/consertar.md`.

## Formato de relatório final de cada agente

Todo agente termina a sua execução com este bloco (é o que o orquestrador lê). Exceção: o `agente-requisitos`, durante a entrevista e a aprovação da spec, pode terminar com `## PERGUNTA` ou `## SPEC PARA APROVAÇÃO` em vez deste bloco — ver seção acima.

```
## RESULTADO: <CONCLUÍDO | BLOQUEADO | REPROVADO>
Evidência: docs/evidencias/<feature>/<arquivo>.md
Arquivos alterados:
- caminho/arquivo (criado | alterado)
Pendências / riscos:
- ...
DELEGAÇÃO (opcional):
- para: <agente-backend | agente-frontend | agente-testes>
  motivo: <o que falta e por quê>
  entrada: <o que o agente destino precisa saber>
```

## Precedência sobre outras regras

Dentro do fluxo `/nova-funcionalidade`, os itens "Mudanças arquivo por arquivo", "Sem Resumos" e "Faça perguntas" de `GENERAL.Diretrizes.instructions.md` são **substituídos** por este documento: os agentes editam todos os arquivos necessários da sua etapa, produzem o bloco de resultado acima e só perguntam nos pontos de parada. Fora do fluxo, `GENERAL.Diretrizes` vale integralmente.

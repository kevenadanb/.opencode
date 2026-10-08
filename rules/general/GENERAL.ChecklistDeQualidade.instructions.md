# CHECKLIST DE QUALIDADE

*Permissão completa para executar os comandos abaixo. Cada item recebe ✅, ❌ ou N/A (com justificativa). Um único ❌ em item marcado 🔴 reprova a entrega.*

Executada pelo Agente de Qualidade ao final de cada funcionalidade (`/nova-funcionalidade`), depois que o `agente-code-review` (etapa 5) confirmar `VEREDITO: SEM BLOQUEIO`, ou sob demanda com `/checklist-qualidade`. O resultado é gravado em `docs/evidencias/<feature>/06-checklist-qualidade.md` conforme `GENERAL.Evidencias.instructions.md`.

## 1. Build e tipagem 🔴

- [ ] `npm run types:generate` (se houve mudança de schema) — types regenerados e commitados
- [ ] `npm run type-check` — sem erros
- [ ] `npm run lint` — sem warnings
- [ ] `npm run format` — código formatado (ou `format:check` sem diferenças)
- [ ] `npm run build` — build bem-sucedido

## 2. Testes e cobertura 🔴

- [ ] Testes unitários existem para toda função, hook e componente novo ou alterado (`GENERAL.react-vitest-test-enforcer`)
- [ ] Testes de integração existem para toda integração nova (RPC ↔ service ↔ hook ↔ componente)
- [ ] Testes de banco (pgTAP) existem para functions, triggers e policies RLS novos (`BACKEND.Testes`)
- [ ] `npm run test -- --run` — 100% dos testes passam; saída colada na evidência
- [ ] Cobertura das linhas alteradas ≥ 90% (`npm run test -- --coverage`); arquivos abaixo listados com justificativa
- [ ] Nenhum teste `.skip`, `.only` ou tautológico (asserção que recalcula o valor esperado do mesmo jeito que o código)
- [ ] Cenários cobertos: caso feliz, vazio, inválido, erro/falha de backend, borda, permissão negada

## 3. Padrões de código e arquitetura 🔴

- [ ] Nomenclatura React (`FRONTEND.React.Nomenclatura`): arquivos, hooks, services, types `I[Nome]`
- [ ] Arquitetura em 3 camadas respeitada: Container → Hook → View; View sem chamadas de API; Container sem JSX complexo
- [ ] Nenhuma lógica crítica (cálculo monetário, validação de negócio, transação) no frontend — está em function/trigger no banco e é consumida via RPC (`supabase-metodologia`)
- [ ] Nomenclatura de banco (`BACKEND.Supabase.Nomenclatura`): pt-BR, `fk_id_*`, `fn_`, `tr_`, `vw_`, `idx_`, `timestamp` sem timezone
- [ ] Interfaces TypeScript batem com o schema real (types gerados, não escritos à mão em `src/types/tables`)
- [ ] Sem código morto introduzido, sem abstração especulativa, sem alteração fora do escopo da spec (`GENERAL.Diretrizes`)
- [ ] JSDoc de cabeçalho nos arquivos novos (`GENERAL.GuiaDocumentacao`)
- [ ] Revisão em dois eixos executada (`skills/backend/code-review`): Padrões e Spec, sem achado de severidade alta pendente

## 4. Segurança e LGPD 🔴

- [ ] Toda tabela nova tem RLS habilitado e policies para cada operação exposta; policies testadas com pgTAP para usuário autorizado e não autorizado
- [ ] Functions `SECURITY DEFINER` têm `SET search_path` e validam permissões internamente
- [ ] Nenhum `console.log` com PII, token ou dado financeiro; `localStorage`/`sessionStorage` só com preferências cosméticas (`GENERAL.ReactSegurancaLogsLGPD`)
- [ ] Nenhum segredo, chave `service_role` ou connection string no código, em `.env` versionado ou nas evidências
- [ ] Entradas do usuário validadas no banco (constraints/functions), não apenas na UI
- [ ] Mensagens de erro ao usuário são amigáveis, sem stack trace ou detalhe de infraestrutura
- [ ] Dados pessoais novos mapeados na base legal (`skills/frontend/lgpd-brasil`) quando aplicável

## 5. Performance

- [ ] Toda FK nova tem índice; consultas novas com filtro/ordenação têm índice adequado (`supabase-postgres-best-practices`)
- [ ] Sem N+1: listas carregam relacionamentos em uma query (`select` com embed) ou via view
- [ ] Listagens paginadas (`range`) — nunca `select *` sem limite em tabela que cresce
- [ ] `EXPLAIN ANALYZE` executado nas queries/views novas em tabelas com volume relevante; saída na evidência
- [ ] Componentes de lista com `key` estável (`react-keys`); memoização apenas onde medida (sem `useMemo` especulativo)
- [ ] Bundle: nenhuma dependência nova sem justificativa na evidência

## 6. Observabilidade

- [ ] Erros de service/RPC capturados e registrados com código de correlação, sem PII
- [ ] Estados de loading, vazio e erro presentes em toda tela nova
- [ ] Triggers de auditoria (`hist_*`) em tabelas que a spec marca como auditáveis
- [ ] Functions críticas retornam `(sucesso, mensagem)` ou lançam exceção com `ERRCODE` explícito, nunca falham silenciosamente

## 7. Acessibilidade e UX

- [ ] `verificar-acessibilidade` executada: roles/labels, navegação por teclado, contraste, foco visível
- [ ] Layout validado em mobile (≤ 400px), tablet e desktop
- [ ] Componentes seguem o design system (`ui-ux-design-system`) e MUI (`MCP.MaterialUI`)

## 8. Documentação e rastreabilidade

- [ ] `docs/evidencias/<feature>/` completa: `00` a `05` presentes (incluindo `05-code-review.md` com `VEREDITO: SEM BLOQUEIO`), com saídas reais de comando
- [ ] Changelog atualizado (`atualizar-changelog`) na seção `[Unreleased]`
- [ ] Item de menu/rota registrado quando a spec inclui tela nova (`adicionar-item-menu`)
- [ ] Critérios de aceitação da spec mapeados 1:1 para testes (tabela na evidência de testes)

## 9. Riscos técnicos (análise, não bloqueia)

Listar em `06-checklist-qualidade.md`:

- Dívida técnica introduzida ou detectada e por que foi aceita
- Pontos de falha únicos (function sem tratamento de concorrência, dependência de serviço externo sem fallback)
- Impacto em dados existentes (migration com `UPDATE`/`ALTER` em tabela populada) e plano de rollback
- Compatibilidade com features existentes que consomem os mesmos objetos

## Veredito

```
VEREDITO: APROVADO | REPROVADO
Itens 🔴 reprovados: <n>
Devolver para: <agente-backend | agente-frontend | agente-testes | nenhum>
```

## Pré-commit (executado pelo orquestrador após APROVADO e aprovação humana)

- [ ] `git pull origin main` (ou branch base)
- [ ] `git status` — apenas arquivos da feature e das evidências
- [ ] `git add <arquivos>` — granular, por escopo
- [ ] `git commit -m "tipo(escopo): resumo"` — Conventional Commits pt-BR (`GENERAL.DiretrizesRegrasGovernancaGit`)
- [ ] `git push` **somente** com aprovação expressa

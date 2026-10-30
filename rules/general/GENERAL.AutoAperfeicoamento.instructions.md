# Auto aperfeiçoamento recursivo dos agentes

Todo agente do workspace opera como um sistema de melhoria contínua: depois de cada tarefa avalia o próprio resultado, registra o que deu errado e por quê, e usa essas lições nas execuções seguintes. O ciclo é **planejar → executar → avaliar → aprender → melhorar**, sempre validado por evidência e métrica objetiva, nunca por impressão.

## Limite honesto do mecanismo

Um agente não tem memória entre execuções nem altera a si mesmo. O aprendizado só existe se for **gravado em arquivo versionado e lido na execução seguinte**. Por isso esta regra se apoia em dois artefatos:

| Artefato | Onde | Quem escreve |
|---|---|---|
| Retrospectiva da execução | bloco `## RETROSPECTIVA` no relatório final do agente | cada agente |
| Lições: um arquivo por lição | `docs/aprendizado/licoes/L-<nnn>.md` no repositório do projeto | orquestrador (consolida as retrospectivas; evita edição concorrente) |
| Índice das lições | `docs/aprendizado/INDICE.md` (uma linha por lição) | orquestrador |
| Métricas | `docs/aprendizado/metricas.md` | orquestrador |

Dois efeitos que a regra **não** promete: melhoria garantida (com poucas execuções a amostra não prova nada — ver "Validação") e alteração automática de agentes, regras ou hooks (só com aprovação humana — ver "Promoção").

## O ciclo

1. **Ler** — antes de começar, leia só `docs/aprendizado/INDICE.md` (se existir). Selecione as lições com status `ativa` ou `hipótese`, cujo `agente` seja o seu ou `todos` e cujas `tags` ou `gatilho` casem com a tarefa; abra apenas os arquivos `licoes/L-<nnn>.md` dessas lições, no máximo **10** (priorize `validada`/`ativa` e as de maior `reincidências`). Cite no começo da evidência os IDs aplicados (`Lições aplicadas: L-007, L-012`). Se o orquestrador já indicou IDs na chamada, comece por eles e confirme no índice se falta alguma.
2. **Executar** a tarefa conforme o fluxo normal (`GENERAL.FluxoAgentes`).
3. **Avaliar** o resultado contra critérios definidos: critérios de aceitação da spec, a checklist do agente, o veredito da etapa seguinte. Use fatos (saída de comando, achado do revisor), não autoavaliação subjetiva.
4. **Detectar** falhas, inconsistências e retrabalho: o que foi devolvido por outro agente, o que falhou na primeira execução, o que precisou ser refeito, o que foi assumido sem verificar.
5. **Causa raiz** — para cada falha, a causa provável **com a evidência que a sustenta**. Sem evidência, marque `causa não confirmada`; não invente explicação.
6. **Hipótese de correção** — uma ação concreta e observável ("rodar `npm run type-check` antes de entregar o frontend"), não uma intenção ("ter mais cuidado").
7. **Registrar** a lição (formato abaixo) na `## RETROSPECTIVA`.
8. **Aplicar** nas execuções futuras (passo 1 do ciclo seguinte).
9. **Medir** se houve melhoria real, com as métricas abaixo, e comparar com o histórico.

## Bloco `## RETROSPECTIVA` (obrigatório no relatório final)

Vai logo antes de `## RESULTADO`. Curto: só o que tem conteúdo.

```
## RETROSPECTIVA
Lições aplicadas: <IDs | nenhuma>
Resultado vs. critérios: <o que foi atendido / o que não foi, com a evidência>
Erros detectados:
- <erro> · causa raiz: <causa + evidência | causa não confirmada> · ação corretiva: <ação concreta>
Lições novas propostas:
- <ver formato de lição>
Efeito de lição anterior:
- <ID>: <o erro reincidiu? sim/não · métrica antes → depois>
Comparação com a execução anterior: <métricas do agente agora vs. antes | sem base de comparação>
```

Se não houve erro, diga isso e registre apenas o efeito das lições aplicadas. Não invente erro para preencher o bloco.

## Formato do registro de lições

Cada lição é um arquivo próprio, `docs/aprendizado/licoes/L-<nnn>.md`:

```markdown
---
id: L-<nnn>
titulo: <título curto>
agente: <nome | todos>
status: hipótese | ativa | validada | refutada | arquivada
tags: [<ex.: rls, migration, mui, teste, spec>]
reincidencias: <n>
---

- gatilho: <situação em que a lição se aplica>
- erro observado: <o que aconteceu, com link para a evidência: docs/evidencias/<feature>/...>
- causa raiz: <causa + evidência>
- ação: <o que fazer diferente, verificável>
- métrica de validação: <qual métrica deve melhorar>
- ocorrências: <feature/data em que o erro apareceu>
- histórico: <data · mudança de status · motivo>
```

O ID é sequencial (`L-001`, `L-002`, …): olhe o maior ID em `INDICE.md` e na pasta `licoes/` antes de criar o próximo; nunca reutilize um ID, nem de lição arquivada ou refutada. Tags: poucas, em minúsculas, reaproveitando as já existentes no índice antes de criar uma nova.

### Índice (`docs/aprendizado/INDICE.md`)

Uma linha por lição, mantida pelo orquestrador a cada criação ou mudança de status. É a **única** leitura obrigatória dos agentes; o arquivo da lição vence em caso de divergência com o índice (corrija o índice).

```markdown
| ID | Título | Agente | Status | Tags | Gatilho | Reincid. |
|---|---|---|---|---|---|---|
| L-001 | <título> | backend | ativa | rls, migration | <gatilho em uma linha> | 0 |
```

Lições `refutada` e `arquivada` permanecem no índice (evita reutilizar ID e repetir hipótese refutada), mas agentes as ignoram na leitura, exceto para checar reincidência.

## Métricas objetivas

O orquestrador acrescenta uma linha por funcionalidade/correção em `docs/aprendizado/metricas.md`, retirada de dados que **já existem** nas evidências (sem medição nova):

| Métrica | Fonte |
|---|---|
| Ciclos de correção usados (0–3) | `STATUS.md` |
| Achados de severidade alta / média / baixa do code review | `05-code-review.md` |
| Itens 🔴 reprovados na checklist de qualidade | `06-checklist-qualidade.md` |
| Testes que falharam na primeira execução da suíte | `03-testes-unitarios.md` |
| Critérios da spec sem teste ao fim da etapa de testes | `04-testes-integracao.md` |
| Perguntas de entrevista que o código responderia | `00-spec.md` |
| Reincidências (erro de lição já registrada) | `INDICE.md` (coluna `Reincid.`) |

Compare cada métrica com a média das últimas 3 funcionalidades e informe a direção (melhorou / igual / piorou). Com menos de 3 funcionalidades registradas, escreva **"sem base suficiente para afirmar melhoria"** em vez de concluir.

## Critério de registro (o que o orquestrador não decide por gosto)

Para cada `## RETROSPECTIVA` recebida (inclusive de ciclos de correção), o orquestrador percorre `Erros detectados` e `Lições novas propostas` e grava em `docs/evidencias/<feature>/07-aprendizado.md` uma linha por item: `item → L-<nnn> (criada | reaberta)` ou `descartado: <motivo>`.

Vira lição (ou reabre a existente) **obrigatoriamente**:

- erro detectado com ação corretiva concreta, mesmo sem impacto no resultado;
- item devolvido por outro agente ou que gerou ciclo de correção;
- desvio de protocolo que o orquestrador precisou corrigir ou notou (bloco `## RETROSPECTIVA` ou `## RESULTADO` ausente, evidência não gravada, agente chamado de novo só para reenviar o bloco);
- erro cujo gatilho já consta no índice (reincidência).

Só se descarta sem lição um item sem causa nem ação verificável, e o motivo é escrito na linha. Sem erro algum, o arquivo registra "nenhum erro; nenhuma lição" e o efeito das lições aplicadas. Sem `07-aprendizado.md`, a etapa não está concluída.

## Validação: quando uma lição vale

- Toda lição nasce como `hipótese`. Passa a `ativa` quando aplicada na primeira execução seguinte.
- Passa a `validada` só quando, em pelo menos **3 execuções posteriores em que o gatilho se aplicou**, o erro não reincidiu **e** a métrica de validação não piorou. Registre as execuções no histórico.
- Se o erro reincidir com a lição aplicada, ela vai para `refutada`: reavalie a causa raiz antes de propor outra ação. **Não repita a mesma ação esperando resultado diferente.**
- Lição sem gatilho aplicado em 10 funcionalidades seguidas → `arquivada`.
- Correlação não é causa: se a métrica melhorou mas houve outra mudança relevante no período (novo agente, regra alterada, feature mais simples), registre a ressalva em vez de creditar a lição.

## Reincidência

Antes de propor uma lição, procure no `INDICE.md` (por tags e gatilho, incluindo `refutada` e `arquivada`) uma lição com o mesmo gatilho ou a mesma causa raiz; abra o arquivo dela para confirmar. Se existir, **não crie outra**: reabra a existente, incremente `reincidências` e revise a ação e a causa raiz. Erro já identificado que se repete sem reavaliação da solução é falha do processo, e deve ser citado na retrospectiva como tal.

## Revisão periódica

A cada 5 funcionalidades concluídas (ou 10 lições novas), o orquestrador propõe ao usuário uma revisão do registro: lições conflitantes entre si, premissas que deixaram de valer (stack, regra, agente mudou), lições `validada` candidatas à promoção, lições a arquivar. Manter no máximo ~60 lições `ativa`/`hipótese` — acima disso, consolide ou arquive; um índice grande demais deixa de ser lido. Revise também as tags: junte sinônimos e remova as que ficaram sem uso.

## Promoção: de lição para regra

Lição `validada` pode virar regra permanente (edição em `rules/`, `agents/` ou `skills/`). O agente **propõe** a mudança como diff na retrospectiva ou no resumo do orquestrador; quem decide é o usuário, e a alteração segue `GENERAL.DiretrizesRegrasGovernancaGit` (commit só com aprovação). Nenhum agente edita regras, agentes, skills, hooks ou permissões por conta própria.

## Guardrails (a lição nunca pode)

- **Relaxar** uma regra obrigatória: testes, revisão de código, checklist de qualidade, RLS e demais regras de segurança, pontos de parada com humano. Lição só pode acrescentar rigor ou eliminar retrabalho dentro delas.
- **Conter dado sensível**: sem segredo, token, chave de serviço, connection string, CPF, e-mail ou outro dado pessoal real (`GENERAL.ReactSegurancaLogsLGPD`). Descreva o padrão, não o dado.
- **Basear-se em suposição**: sem evidência referenciável (arquivo de evidência, saída de comando, achado do revisor), a lição fica `hipótese` e não altera comportamento além do que já era obrigatório.
- **Ampliar escopo**: aprender não autoriza fazer trabalho que a spec não pediu (`GENERAL.Diretrizes`, "Mudanças cirúrgicas").
- **Maquiar resultado**: ajustar teste, critério ou métrica para parecer melhor é o oposto desta regra.

## Quem faz o quê

- **Cada agente (1–6):** lê lições (passo 1), grava `## RETROSPECTIVA` no relatório final e dentro do arquivo de evidência da sua etapa (seção `## Retrospectiva`).
- **Orquestrador (`/nova-funcionalidade`, `/consertar`):** cria `docs/aprendizado/` (com `licoes/`, `INDICE.md` e `metricas.md`) se não existir **no Passo 0, antes de chamar o primeiro agente** (assim todos os agentes leem o índice, mesmo vazio, na primeira execução), consolida cada retrospectiva em um arquivo `licoes/L-<nnn>.md` (criando a lição ou atualizando a existente) e atualiza `INDICE.md` e `metricas.md`. Na chamada de cada agente, deriva as tags da solicitação, escolhe no índice as lições relevantes ao papel dele e passa os IDs; também dispara a revisão periódica. Os arquivos de `docs/aprendizado/` entram no mesmo commit da funcionalidade, em linha própria na `08-commit.md`. A consolidação é uma **etapa numerada do `STATUS.md`** (7, Aprendizado, evidência `07-aprendizado.md`), e o commit não começa sem ela ✅.
- **Comandos avulsos (`/revisao-codigo`, `/checklist-qualidade`) e modo Cowork (`ciclo-desenvolvimento`):** o agente aplica o passo 1 e entrega a retrospectiva ao usuário; o registro em arquivo só é atualizado se houver orquestrador ou se o usuário pedir.

## Template inicial de `docs/aprendizado/INDICE.md`

```markdown
# Índice de lições aprendidas

Regra: `GENERAL.AutoAperfeicoamento`. Uma lição por arquivo em `licoes/`. IDs sequenciais, nunca reutilizados. Sem dados sensíveis.

| ID | Título | Agente | Status | Tags | Gatilho | Reincid. |
|---|---|---|---|---|---|---|
```

## Template inicial de `docs/aprendizado/metricas.md`

```markdown
# Métricas por funcionalidade

| Data | Funcionalidade | Ciclos | Achados A/M/B | 🔴 reprov. | Testes falhos 1ª exec. | Critérios s/ teste | Perguntas evitáveis | Reincidências |
|---|---|---|---|---|---|---|---|---|
```

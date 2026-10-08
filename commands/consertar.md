---
description: Encaminha para o agente-requisitos (criação/atualização do requisito), corrige a causa raiz, roda revisão de código, testes unitários e de integração, e uma revisão de código final — via agentes especializados
agent: build
---

@.opencode/rules/general/GENERAL.Diretrizes.instructions.md
@.opencode/rules/general/GENERAL.Evidencias.instructions.md
@.opencode/rules/general/GENERAL.FluxoAgentes.instructions.md
@.opencode/rules/general/GENERAL.DiretrizesRegrasGovernancaGit.instructions.md

Você é o **orquestrador** do fluxo de correção de bugs. Diferente de `/nova-funcionalidade`, aqui não existe uma funcionalidade nova do zero — o ponto de partida é um problema que já existe no projeto. Mas, a partir desta versão, **toda correção passa pelo `agente-requisitos` antes de qualquer código ser alterado**: a diferença para `/nova-funcionalidade` é que a entrevista é abreviada (Passo 2) e parte do diagnóstico que você mesmo produziu no Passo 1, em vez de uma spec vazia. O objetivo é que toda correção fique vinculada a um requisito formal, passe por revisão de código antes e depois dos testes, e seja validada por uma suíte completa.

Problema relatado: **$ARGUMENTS**

### Entrada por arquivo (`.md`)

Se `$ARGUMENTS` contiver um caminho terminado em `.md` e o arquivo existir, leia-o por completo e trate o conteúdo como a **fonte primária** do relato (passos para reproduzir, comportamento esperado vs. observado, prints/logs, ambiente). Texto livre que acompanhe o comando é contexto complementar. Se o caminho não existir, avise o usuário e pergunte se quer indicar outro caminho ou seguir só com a descrição livre.

## Passo 0 — Preparação

1. Derive o slug: `YYYY-MM-DD-corrigir-<kebab-case do problema>`. Crie `docs/evidencias/<slug>/` e um `STATUS.md` mínimo, adaptando o template de `GENERAL.Evidencias` para as etapas deste fluxo:

   | # | Etapa | Agente | Evidência |
   |---|---|---|---|
   | 1 | Diagnóstico | orquestrador | 00-diagnostico.md |
   | 2 | Requisito | agente-requisitos | 00-spec.md |
   | 3 | Correção | agente-backend / agente-frontend | 01-backend.md / 01-frontend.md |
   | 4 | Revisão de código (inicial) | agente-code-review | 02-code-review-inicial.md |
   | 5 | Testes | agente-testes | 03-testes-unitarios.md, 04-testes-integracao.md |
   | 6 | Revisão de código (final) | agente-code-review | 05-code-review-final.md |
   | 7 | Qualidade | agente-qualidade | 06-checklist-qualidade.md |
   | 8 | Commit | orquestrador | 07-commit.md |

2. Registre o ponto fixo do git para o diff final: `git rev-parse HEAD` → anote em `STATUS.md` como `Base: <hash>`. Se houver alterações não commitadas fora do escopo, avise o usuário antes de começar. Se o diretório ainda não for repositório git, avise e pergunte como prosseguir (não rode `git init` sozinho num bug fix — isso é decisão do usuário).

## Passo 1 — Diagnóstico (você mesmo, sem subagente)

Este passo é seu, não de um agente especializado: exige explorar o projeto real antes de decidir onde a correção pertence. Use a skill `diagnosing-bugs` como guia.

1. **Reproduza o problema** sempre que possível: rode a aplicação/teste relevante, reproduza os passos do relato, capture o erro real (stack trace, log, comportamento incorreto na UI). Se não for possível reproduzir, registre por quê e prossiga por leitura de código com o nível de confiança mais baixo.
2. **Explore o código relacionado** (`Grep`/`Glob`/`Read`, ou o agente `Explore` se a busca for ampla) até identificar a causa raiz — não pare no primeiro sintoma. Distinga causa raiz de sintoma: um erro na tela pode ter origem numa function do banco, numa policy RLS, numa condição de corrida no hook, etc.
3. **Determine o escopo da correção**: banco/RPC/RLS (`agente-backend`), UI/hook/componente (`agente-frontend`), ambos, ou nenhum dos dois (ex.: dado incorreto em produção, configuração de ambiente — nesses casos não há código para corrigir; explique isso ao usuário e pare aqui, sem chamar nenhum agente, nem o `agente-requisitos`).
4. **Verifique se o problema pertence a uma funcionalidade já especificada**: procure em `docs/evidencias/*/00-spec.md` por uma spec relacionada (mesma tela, RPC, tabela ou fluxo). Se encontrar, anote o caminho — é o `agente-requisitos` quem decide, no Passo 2, se grava um adendo ali. Essa busca não gasta pergunta ao usuário: é verificação sua no sistema de arquivos.
5. Se depois de investigar a causa continuar ambígua entre duas hipóteses plausíveis, **pergunte ao usuário** (`GENERAL.Diretrizes` — não presuma) antes de acionar qualquer agente.
6. Grave `00-diagnostico.md`: relato original (ou link para o `.md` de entrada), passos de reprodução e resultado, causa raiz identificada com evidência (trecho de código/log que comprova), escopo da correção, e o caminho da spec relacionada encontrada no item 4 (se houver). Marque a etapa 1 em `STATUS.md`.

## Passo 2 — Requisito (agente-requisitos)

Chame `agente-requisitos` em **modo correção**. A entrada de início é: o problema relatado, o slug, a pasta de evidências, `00-diagnostico.md` (causa raiz e escopo já apurados por você) e, se encontrado no Passo 1, o caminho da `00-spec.md` de uma funcionalidade relacionada.

O agente decide, a partir disso, entre gravar um adendo numa spec já existente ou uma spec nova restrita à correção — e conduz, se necessário, uma entrevista **abreviada** (0 a 3 perguntas, só quando o diagnóstico deixar dúvida real sobre o comportamento correto esperado). Segue o mesmo protocolo de ping-pong de `GENERAL.FluxoAgentes`:

- **`## PERGUNTA`** → faça a pergunta ao usuário de verdade com `question tool` (a "Sugestão" do agente vira a primeira opção). Retome o mesmo agente com a resposta.
- **`## SPEC PARA APROVAÇÃO`** → mostre o resumo ao usuário e pergunte, com `question tool`, Aprovar / Ajustar / Cancelar. Retome o agente com a decisão.
- **`## RESULTADO: CONCLUÍDO`** → marque a etapa 2 em `STATUS.md` e siga para o Passo 3.
- **`## RESULTADO: BLOQUEADO`** (usuário cancelou) → registre em `STATUS.md` e **encerre o comando aqui**, sem chamar mais nenhum agente.
- Nenhum desses blocos → chame de novo pedindo só o bloco — não presuma sucesso.

## Passo 3 — Correção

Com a causa raiz, o escopo e o requisito aprovado (`00-spec.md`), chame o(s) agente(s) necessário(s), passando `00-diagnostico.md` e `00-spec.md` como entrada (não repita a investigação — eles corrigem a partir da causa e do requisito já definidos):

- Causa no banco/RPC/RLS/function/trigger → `agente-backend`.
- Causa em UI/hook/componente/estado → `agente-frontend`.
- Ambos, se a causa atravessa as duas camadas (ex.: contrato de RPC mudou e o hook consumidor quebrou) — nessa ordem, backend primeiro.

Cada agente corrige **apenas o necessário para sanar a causa raiz e atender aos critérios de aceitação do `00-spec.md`**, sem refatorar código adjacente. Peça que grave a evidência no arquivo próprio da etapa (`01-backend.md` e/ou `01-frontend.md` conforme o agente). Marque a etapa 3 em `STATUS.md`.

## Passo 4 — Revisão de código (inicial)

Consolide os arquivos alterados (`git status --porcelain` + evidências) e chame `agente-code-review` — o mesmo agente por trás de `/revisao-codigo` — com a pasta, a lista de arquivos e `Base: <hash>`. Grave o resultado em `02-code-review-inicial.md`. Marque a etapa 4 conforme o veredito.

Se `BLOQUEADO`: trate como ciclo de correção (ver seção abaixo) — devolva para o(s) agente(s) indicado(s) e repita esta etapa até `SEM BLOQUEIO`. Só avance para o Passo 5 com a revisão inicial `SEM BLOQUEIO`.

## Passo 5 — Testes (unitários e de integração)

Chame `agente-testes` com `00-diagnostico.md`, `00-spec.md`, o(s) arquivo(s) de correção e `02-code-review-inicial.md`. Ele deve:

- Criar um teste **unitário** que **falharia no comportamento antigo** e reproduz o cenário do relato (`GENERAL.react-vitest-test-enforcer` / `BACKEND.Testes`), confirmando que passa com a correção aplicada.
- Criar teste(s) de **integração** sempre que a correção atravessar camadas ou envolver integração real (RPC ↔ service, service ↔ hook, fluxo completo). Quando não for aplicável (ex.: correção pontual numa função pura, sem integração nova), registre o motivo em `04-testes-integracao.md` em vez de pular a evidência.
- Rodar a suíte completa relevante para garantir que nada quebrou.

Evidência em `03-testes-unitarios.md` e `04-testes-integracao.md`, com a saída real dos comandos. Marque a etapa 5.

Se a suíte revelar problemas (o teste de regressão não passa, ou algo mais quebrou): trate como ciclo de correção — devolva para o(s) agente(s) indicado(s), corrija, e reexecute `agente-testes` até a suíte passar limpa antes de seguir para o Passo 6.

## Passo 6 — Revisão de código (final)

Com a correção validada pelos testes, rode **novamente** `agente-code-review` — equivalente a executar `/revisao-codigo` uma segunda vez — sobre o estado atual (incluindo os arquivos de teste criados no Passo 5), para validar o resultado final. Grave em `05-code-review-final.md`. Marque a etapa 6 conforme o veredito.

Se `BLOQUEADO`: novo ciclo de correção — devolva para o(s) agente(s) indicado(s), reexecute `agente-testes` (Passo 5) e rode esta revisão final de novo. Só siga para o Passo 7 com `SEM BLOQUEIO`.

## Passo 7 — Qualidade

Chame `agente-qualidade` com a pasta, a lista de arquivos e `Base: <hash>` (inclua `02-code-review-inicial.md` e `05-code-review-final.md` entre as evidências que ele deve ler). Informe que isto é uma **correção de bug vinculada a um requisito formal** (`00-spec.md`, eventualmente um resumo curto que referencia um adendo em outra spec): ele avalia a checklist normalmente (build, testes, padrões, segurança/LGPD, performance, observabilidade, acessibilidade quando aplicável) e marca como N/A, com a justificativa "correção de bug, spec restrita à correção", qualquer item que dependa de uma spec completa de funcionalidade nova. Marque a etapa 7 conforme o veredito.

## Ciclo de correção (revisão de código BLOQUEADO em qualquer uma das duas passagens, testes falhando, ou qualidade REPROVADO)

Mesmo limite e mecânica de `GENERAL.FluxoAgentes`: incremente `Ciclo de correção: N/3` em `STATUS.md` — contado em conjunto entre o Passo 4, o Passo 5, o Passo 6 e o Passo 7 —, devolva para o(s) agente(s) indicado(s) em `Devolver para`, reexecute `agente-testes`, revise de novo com `agente-code-review` e só então siga para o próximo passo pendente (ou para `agente-qualidade`). No terceiro ciclo reprovado/bloqueado, pare e apresente ao usuário os achados pendentes, o que foi tentado, e pergunte se deseja intervir manualmente, aceitar o risco (registrando em `06-checklist-qualidade.md`) ou cancelar.

## Passo 8 — Commit (pausa humana)

Somente com `VEREDITO: APROVADO`:

1. `git status` e `git diff --stat <Base>...HEAD` — confirme que só há arquivos da correção e de `docs/evidencias/<slug>/`.
2. Proponha a mensagem no padrão `GENERAL.DiretrizesRegrasGovernancaGit` (`fix(<escopo>): <resumo em pt-BR imperativo>`, corpo explicando a causa raiz, o requisito vinculado (link relativo para `00-spec.md` ou para o adendo, quando aplicável) e o que foi corrigido, mais o link relativo para `docs/evidencias/<slug>/`).
3. Grave `07-commit.md` com a mensagem proposta.
4. Pergunte: **"Posso realizar o commit dessas alterações?"** e aguarde. Só execute `git add` granular e `git commit` após resposta afirmativa. Registre o hash em `07-commit.md` e marque a etapa 8.
5. **Nunca** execute `git push`. Informe que o push é manual.

## Relatório final ao usuário

Tela curta, sem repetir o conteúdo das evidências:

- Problema relatado, causa raiz encontrada e o requisito vinculado (spec nova, ou adendo em qual funcionalidade).
- O que foi alterado (arquivos, por camada).
- Revisão de código inicial: achados por severidade e veredito.
- Testes unitários e de integração criados (ou motivo de N/A na integração) e resultado da suíte.
- Revisão de código final: achados por severidade e veredito.
- Ciclos de correção, se houve, e o que foi devolvido em cada um.
- Caminho da pasta de evidências e hash do commit (ou "aguardando aprovação").

## Regras do orquestrador

- Você só edita código no Passo 1 se for necessário para reproduzir o bug (ex.: um script temporário de diagnóstico) — nunca a correção em si; a correção é sempre de `agente-backend`/`agente-frontend`.
- Se o diagnóstico concluir que não há causa corrigível no código (dado incorreto, ambiente, decisão de produto), pare no Passo 1, explique ao usuário e não acione mais nenhum agente — nem o `agente-requisitos`.
- Você nunca escreve nem aprova o `00-spec.md` sozinho: isso é sempre do `agente-requisitos`, com aprovação explícita do usuário.
- `STATUS.md` é atualizado **antes** de chamar o próximo agente, nunca em lote no final.
- Se um agente retornar sem o bloco esperado para a etapa em curso (`## RESULTADO`, ou `## PERGUNTA`/`## SPEC PARA APROVAÇÃO` no Passo 2), chame-o de novo pedindo apenas o bloco — não presuma sucesso.

> Uso: `/consertar <descrição do problema> | <caminho/para/relatorio-bug.md>` — argumentos disponíveis como `$ARGUMENTS`.

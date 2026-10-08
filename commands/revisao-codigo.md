---
description: Roda a revisão de código dedicada (bugs, segurança, legibilidade, performance, boas práticas, manutenibilidade) no diff atual, via agente-code-review
agent: build
---

@.opencode/rules/general/revisao_codigo_automatizada.instructions.md

Invoque o subagente `@agente-code-review` com:

- ponto fixo do diff: `$ARGUMENTS` (se vazio, use `main`; se `main` não existir, o commit inicial da branch atual);
- pasta de evidências: a informada em `$ARGUMENTS` ou, se não houver, crie `docs/evidencias/<YYYY-MM-DD>-revisao-avulsa/` com `STATUS.md` mínimo e informe ao agente que as evidências `00` a `04` **não existem** — nesse modo ele revisa só o diff, sem cruzar com spec ou matriz de testes.

Ao receber o bloco `## RESULTADO`, apresente ao usuário os achados por dimensão e severidade e o veredito (`SEM BLOQUEIO` / `BLOQUEADO`). Para cada achado de severidade alta, diga o que precisa ser corrigido antes de seguir para a checklist de qualidade ou para o commit. Não execute nenhuma correção — este comando só revisa.

> Uso: `/revisao-codigo [ponto fixo do git, ex.: main ou HEAD~3] [pasta de evidências, opcional]` — argumentos disponíveis como `$ARGUMENTS`.

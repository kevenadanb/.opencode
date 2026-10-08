---
description: Roda a checklist de qualidade completa (build, testes, padrões, segurança/LGPD, performance, observabilidade, acessibilidade, documentação) no estado atual do projeto, via agente-qualidade
agent: build
---

@.opencode/rules/general/GENERAL.ChecklistDeQualidade.instructions.md

Invoque o subagente `@agente-qualidade` com:

- ponto fixo do diff: `$ARGUMENTS` (se vazio, use `main`; se `main` não existir, o commit inicial da branch atual);
- pasta de evidências: a informada em `$ARGUMENTS` ou, se não houver, crie `docs/evidencias/<YYYY-MM-DD>-checklist-avulsa/` com `STATUS.md` mínimo e informe ao agente que as evidências `00` a `05` **não existem** — nesse modo ele marca o item 8 como N/A com a justificativa "checklist avulsa" e executa todos os demais itens normalmente (inclusive rodando `/revisao-codigo` ou a skill `code-review` por conta própria, se quiser cruzar achados).

Ao receber o bloco `## RESULTADO`, apresente ao usuário a checklist com ✅/❌/N/A, os achados por severidade e o veredito. Para cada ❌, diga o que precisa ser corrigido antes de commitar ou dar deploy. Não execute nenhuma correção nem `git commit` — este comando só avalia.

> Uso: `/checklist-qualidade [ponto fixo do git, ex.: main ou HEAD~3] [pasta de evidências, opcional]` — argumentos disponíveis como `$ARGUMENTS`.

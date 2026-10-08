---
name: mui-tooltip-disabled
description: 'Garante o uso correto de `Tooltip` do MUI com elementos desabilitados, evitando warnings e melhorando a acessibilidade. Use ao adicionar Tooltip em botões ou elementos disabled.'
---

# Skill: MUI Tooltip with Disabled Elements

Resumo: Detecta usos de `Tooltip` envolvendo elementos com `disabled={true}` sem wrapper e sugere o padrão correto (envolver em `<span>` ou `display: inline-flex` para layout).

Suggestions:
- Detectar `Tooltip` cujo filho é um elemento com `disabled` e recomendar envolver o filho em `<span>`.
- Sugerir títulos dinâmicos para estados habilitado/desabilitado (ex.: `title={isEnabled ? 'Salvar' : 'Preencha os campos'}`).
- Recomendar estilos `display: inline-block`/`inline-flex` quando necessário para layout (ex.: `fullWidth`).

Manual verification steps:
1. Verificar que elementos desabilitados usados dentro de `Tooltip` estão envolvidos por wrapper leve (`<span>`).
2. Testar se o `Tooltip` aparece nos estados habilitado/desabilitado e que não há warnings no console.
3. Confirmar que o wrapper não contém handlers ou props `disabled` indevidos.

Examples (quick fixes):
- Transformar `
  <Tooltip title="Salvar">
    <Button disabled>Salvar</Button>
  </Tooltip>
  `
  em
  `
  <Tooltip title={isValid ? 'Salvar' : 'Complete os campos'}>
    <span style={{ display: 'inline-block' }}>
      <Button disabled={!isValid}>Salvar</Button>
    </span>
  </Tooltip>
  `

Testing guidance:
- Adicionar testes que renderizem componentes com `Tooltip` e elementos `disabled` e assertem ausência de warnings e comportamento esperado (tooltip visível via events when wrapped).

References:
- https://mui.com/material-ui/react-tooltip/#disabled-elements

Notes:
- Skill sugere correções e exemplos; não altera código automaticamente. Reforça acessibilidade e evita warnings do MUI.

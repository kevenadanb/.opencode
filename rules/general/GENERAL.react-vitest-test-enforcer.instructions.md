# Test Instructions

Este arquivo define a regra obrigatória para qualquer nova feature, correção ou refatoração em React: testes automatizados devem ser criados e executados antes da entrega.

Use a skill `.opencode/skills/react-vitest-test-enforcer` para seguir o padrão do workspace.

## Regra principal

- Toda nova feature em React deve incluir testes unitários e de integração.
- Qualquer correção de comportamento que altere UI, estado, regras de negócio ou chamadas de API também deve ter testes.
- Código não pode ser entregue sem testes quando houver comportamento novo ou alterado.
- Os testes precisam ser criados na mesma tarefa em que a feature foi implementada.

## Stack esperada

- Vitest
- React Testing Library
- @testing-library/user-event
- MSW para APIs
- jsdom

## O que deve ser coberto

### Testes unitários

Cobrir:
- fluxo feliz
- estados vazios
- valores inválidos
- casos de borda
- tratamento de erro
- regras de negócio
- helpers e utilitários
- hooks customizados

### Testes de componentes

Cobrir:
- renderização correta
- interações do usuário
- loading, erro e vazio
- callbacks disparados
- acessibilidade básica
- comportamento condicional

### Testes de integração

Cobrir:
- comunicação entre componentes
- chamadas de API
- fluxos completos do usuário
- falhas de backend
- atualização de estado
- navegação quando existir

## Boas práticas

- Prefira testes que validem comportamento visível ao usuário, não detalhes de implementação.
- Use `screen.getByRole()`, `screen.findByRole()` e `screen.getByText()` quando possível.
- Mocke APIs com MSW, e não apenas com objetos simulados isolados.
- Cubra sucesso, erro e cenários de borda.
- Não ignore cenários de loading, empty state e falha de resposta.
- Mantém o teste próximo ao comportamento real do usuário.

## Checklist obrigatório

Antes de concluir a tarefa, verificar:

- [ ] feature implementada
- [ ] testes unitários criados
- [ ] testes de integração criados
- [ ] casos de erro cobertos
- [ ] edge cases cobertos
- [ ] comportamento principal validado
- [ ] todos os testes executam com sucesso
- [ ] comando /checklist-qualidade executado após os testes

## Observação

Se houver alguma exceção real para não criar testes, ela deve ser justificada explicitamente e a validação alternativa deve ser documentada. Em geral, a regra do projeto é: sem testes, sem entrega.

> Fluxo recomendado: implementar → testar → executar /checklist-qualidade → concluir.
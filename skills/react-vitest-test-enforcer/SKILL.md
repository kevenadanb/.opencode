---
name: react-vitest-test-enforcer
description: Obriga a criação de testes unitários e de integração para toda nova feature React.
---

# React + Vitest Test Enforcer

Você é um engenheiro de software especialista em React, TypeScript, Vitest, React Testing Library e MSW.

## Regra Principal

Toda nova feature, correção, refatoração ou componente criado DEVE incluir testes.

NUNCA entregue código sem testes.

Se uma feature for implementada, os testes devem ser criados na mesma tarefa.

## Stack de Testes

Utilize:

- Vitest
- React Testing Library
- MSW para APIs
- jsdom
- @testing-library/user-event

## Cobertura Obrigatória

Para cada nova feature criar:

### Testes Unitários

Cobrir:

- fluxo feliz
- estados vazios
- valores inválidos
- edge cases
- tratamento de erro
- funções utilitárias
- hooks customizados
- regras de negócio

### Testes de Componentes

Cobrir:

- renderização
- interações do usuário
- estados loading
- estados de erro
- estados vazios
- acessibilidade básica
- callbacks disparados

### Testes de Integração

Cobrir:

- comunicação entre componentes
- chamadas de API
- fluxos completos do usuário
- tratamento de falhas de backend
- atualizações de estado
- navegação quando existir

## Checklist Obrigatório

Antes de concluir qualquer tarefa verificar:

- [ ] Feature implementada
- [ ] Testes unitários criados
- [ ] Testes de integração criados
- [ ] Casos de erro cobertos
- [ ] Edge cases cobertos
- [ ] Cobertura mínima de 90%
- [ ] Todos os testes executam com sucesso

## Estrutura Esperada

src/
├── components/
│   ├── UserCard.tsx
│   ├── UserCard.test.tsx
│
├── features/
│   ├── users/
│   │   ├── UserList.tsx
│   │   ├── UserList.test.tsx
│
├── hooks/
│   ├── useUsers.ts
│   ├── useUsers.test.ts

## React Testing Library

Preferir:

```tsx
screen.getByRole()
screen.findByRole()
screen.getByText()
``
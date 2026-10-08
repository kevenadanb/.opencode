---
name: react-convencoes
description: 'Valida e sugere nomes seguindo a nomenclatura do projeto (components, hooks, services) e a arquitetura em 3 camadas. Use ao criar ou renomear componentes, hooks ou services React.'
---

# Convenções de Nomenclatura — React

Valida e sugere nomes seguindo os padrões de nomenclatura do projeto e a arquitetura em 3 camadas.

## 🎯 Validações

### Arquivos

- ✅ **Componentes**: `PascalCase.tsx` (ex: `UserProfile.tsx`)
- ✅ **Hooks**: `use[Nome].ts` (ex: `useUserProfile.ts`)
- ✅ **Serviços**: `[entidade]Service.ts` (ex: `userService.ts`)
- ✅ **Tipos**: `I[Nome].ts` (ex: `IUserProfile.ts`)

### Estrutura de Features

```
src/components/pages/[Modulo]/
├── Listar[Entidades]/
│   ├── Listar[Entidades].tsx           # Container
│   ├── Listar[Entidades]DataGrid.tsx   # DataGrid MUI
│   ├── Listar[Entidades]ActionsCell.tsx # Ações da linha
│   └── useListar[Entidades].ts         # Hook da listagem
└── Manter[Entidade]/
    ├── Manter[Entidade].tsx            # Container
    ├── Manter[Entidade]Form.tsx        # Formulário
    └── useManter[Entidade].ts          # Hook do formulário
```

## 🏗️ Arquitetura em 3 Camadas

```
[Feature].tsx → use[Feature].ts → [Feature]Form.tsx
   (Container)     (Lógica)        (Apresentação)
```

### Responsabilidades por Camada

**Container Component (`[Feature].tsx`)**:

- Instancia o hook personalizado
- Fornece layout e estrutura
- Gerencia roteamento e navegação

**Custom Hook (`use[Feature].ts`)**:

- Estados da feature
- Efeitos e carregamento de dados
- Handlers de eventos
- Validações de formulário
- Metadados (títulos, subtítulos)

**Form Component (`[Feature]Form.tsx`)**:

- Recebe props do hook
- Foca apenas na apresentação
- Componentes de UI puros

## 🔍 Detecção Automática

### Nomes Incorretos Detectados

- ❌ `userprofile.tsx` → ✅ `UserProfile.tsx`
- ❌ `UseUser.ts` → ✅ `useUser.ts`
- ❌ `user-service.ts` → ✅ `userService.ts`
- ❌ `userType.ts` → ✅ `IUser.ts`

### Estrutura Incorreta

- ❌ Hooks globais em features locais
- ❌ Lógica de negócio em components de apresentação
- ❌ Estados espalhados em múltiplos arquivos

## 📁 Organização de Hooks

### Hooks Globais (`src/hooks/`)

**Quando usar**: Funcionalidade reutilizável em toda aplicação

**Exemplos**:

- `useDebounce.ts` - Debounce de inputs
- `useDeviceDetect.ts` - Detecção de dispositivo
- `useFormatValidation.ts` - Formatação e validação

### Hooks de Feature (`src/components/pages/[Feature]/`)

**Quando usar**: Lógica específica de uma entidade/feature

**Exemplos**:

- `useManterUsuario.ts` - CRUD de usuário
- `useListarUsuarios.ts` - Listagem com filtros

## ⚡ Gatilhos de Ativação

- Criação de novos arquivos `.tsx`, `.ts`
- Renomeação de componentes ou hooks
- Detecção de estrutura inadequada
- Movimentação de arquivos entre diretórios

## 🛠️ Sugestões Automáticas

### Ao criar arquivo

```typescript
// Detecta: userProfile.tsx
// Sugere: UserProfile.tsx

// Detecta: UseProfile.ts
// Sugere: useProfile.ts (se for hook) ou IProfile.ts (se for tipo)
```

### Ao organizar features

```typescript
// Detecta: Hook de negócio em src/hooks/
// Sugere: Mover para src/components/pages/[Feature]/

// Detecta: Hook reutilizável em feature
// Sugere: Mover para src/hooks/
```

## 📋 Validações de Estrutura

**3 Camadas Obrigatórias**:

- [ ] Container existe e usa hook
- [ ] Hook encapsula toda lógica
- [ ] Form recebe props e renderiza UI

**Organização de Hooks**:

- [ ] Hooks globais são reutilizáveis
- [ ] Hooks de feature são específicos
- [ ] Sem mistura de responsabilidades

## When NOT to use

- Não usar para regras de negócio; apenas para convenções de arquivo/nome.
- Não aplicar automaticamente quando houver dependências históricas que exigem migração coordenada.

## Manual verification steps

1. Conferir PRs de criação/renomeação de arquivos e confirmar que os nomes seguem o padrão.
2. Testar builds e imports para evitar regressões após renomeações.
3. Notificar owner (`@frontend`) quando regras de naming causarem impacto em múltiplos pacotes.

---

**Baseado em**: `rules/frontend/FRONTEND.React.Nomenclatura.instructions.md`

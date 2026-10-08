---
name: adicionar-item-menu
description: 'Guia para adicionar itens e subitens ao menu lateral (Sidebar) do Admin e Alunos Web. Use ao adicionar, criar, remover ou reordenar itens de menu/sidebar, rotas de navegação ou entradas do menu.'
---

# Skill de Menu Lateral (Sidebar)

Esta skill guia o processo de adicionar novas rotas e itens ao menu de navegação lateral.

## 📂 Arquivo de Configuração

Os itens do menu são definidos programmaticamente no hook de configuração. **Arquivo Alvo:** `src/components/layouts/Sidebar/menuConfig.ts` (ou similar, procure por `useAdminMenuConfig` ou `useMenuUsuario`).

## 📝 Passo a Passo

### 1. Importar Ícone (MUI)

Edite o arquivo `menuConfig.ts` para importar o ícone desejado do Material UI.

```typescript
import {
     Dashboard as DashboardIcon,
     Receipt as ReceiptIcon, // ✅ Novo ícone
} from '@mui/icons-material';
```

### 2. Adicionar Item ao Array

Localize o array `dynamicMenu` dentro do hook e adicione o objeto do novo item.

#### Exemplo: Item Simples

```typescript
{
  id: 'novo-item',        // Kebab-case único
  text: 'Novo Item',      // Texto visível
  icon: ReceiptIcon,      // Componente do ícone
  path: '/app/novo-path', // Rota completa (inicie com /app/)
}
```

#### Exemplo: Item com Submenu

```typescript
{
  id: 'financeiro',
  text: 'Financeiro',
  icon: PaymentIcon,
  subItems: [
    {
      id: 'boletos',
      text: 'Meus Boletos',
      icon: ReceiptIcon,
      path: '/app/financeiro/boletos',
    }
  ]
}
```

## ✅ Checklist de Validação

1.   **ID Único:** O `id` não pode repetir.
2.   **Rota Existente:** Certifique-se de que o `path` está definido no `AppRoutes.tsx`.
3.   **Ícone Importado:** Não use string, use o componente importado.
4.   **Prefixo:** Todas as rotas internas devem começar com `/app/`.

## 🐛 Problemas Comuns

- **Menu não aparece:** Verifique se o item foi adicionado dentro do `useMemo` correto.
- **Clique não navega:** Verifique se o `path` está correto e corresponde a uma Rota definida.

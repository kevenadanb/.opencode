## 🎯 Convenções de Nomenclatura

### Arquivos:

-    **Componentes**: `PascalCase.tsx`
-    **Hooks**: `use[Nome].ts`
-    **Serviços**: `[entidade]Service.ts`
-    **Tipos**: `I[Nome].ts`

### Estrutura de Features:

-    **Container**: `[Feature].tsx`
-    **Form**: `[Feature]Form.tsx`
-    **Hook**: `use[Feature].ts`
-    **DataGrid**: `[Feature]DataGrid.tsx`

## 🎣 Organização de Hooks

### Hooks Globais (`src/hooks/`)

-    **Funcionalidade**: Reutilizáveis em toda aplicação
-    **Escopo**: Sem lógica de negócio específica
-    **Exemplos**: `useDebounce`, `useDeviceDetect`, `useFormatValidation`

### Hooks de Feature (`src/components/pages/[Feature]/`)

-    **Funcionalidade**: Lógica específica de uma feature
-    **Escopo**: Estados e operações de uma entidade
-    **Exemplos**: `useManterEntidade`, `useListarEntidades`

### Organização por Feature

```
src/components/pages/
└── [Modulo]/                    # Ex: Financeiro, Pessoas, Planos
    ├── Listar[Entidades]/       # Ex: ListarPlanos/
    │   ├── Listar[Entidades].tsx            # Componente container
    │   ├── Listar[Entidades]DataGrid.tsx    # DataGrid com MUI
    │   ├── Listar[Entidades]ActionsCell.tsx # Ações da linha
    │   ├── Listar[Entidades]CustomToolbar.tsx # Toolbar customizada
    │   └── useListar[Entidades].ts          # Hook da listagem
    └── Manter[Entidade]/        # Ex: ManterPlano/
        ├── Manter[Entidade].tsx             # Componente container
        ├── Manter[Entidade]Form.tsx         # Formulário de apresentação
        ├── Manter[Entidade]Modal.tsx        # Modal alternativo
        └── useManter[Entidade].ts           # Hook do formulário
```

### Separação de Responsabilidades

**🎯 Padrão em 3 Camadas (Arquitetura Obrigatória)**

### 1. Camada 1: Container ({Feature}.tsx)
- Responsabilidade: Conectar o custom hook à view de apresentação.
- Não contém renderização complexa de JSX.
- Não faz chamadas diretas a APIs.
- Exemplo:

  ````tsx
  export const DeviceShowcase: React.FC<DeviceShowcaseProps> = (props) => {
    const showcaseState = useDeviceShowcase(props);
    return <DeviceShowcaseView {...showcaseState} />;
  };
  ````
  
### 2. Camada 2: Custom Hook (use{Feature}.ts)
- Responsabilidade: Gerenciar todo o estado, effects, memoização e chamadas de serviço.
- Retorna um objeto coeso com estados e callbacks (handlers).
- Isola a lógica para facilitar testes unitários e refatorações.

### 3. Camada 3: Apresentação / View ({Feature}View.tsx)
- Responsabilidade: Renderização visual de elementos, Material UI e acessibilidade.
- É puramente funcional (stateless ou com estado efêmero de UI estritamente local).
- Recebe todos os dados e callbacks via props.
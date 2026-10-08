---
description: Padrão obrigatório de UI/UX com Material UI para telas de gestão CRUD no projeto Clínica Mundos.
applyTo: 'src/**/*.tsx'
---

# Padrão de Design de Telas (UI/UX Design System)

Especificação visual e de UX para telas de gestão/listagem usando Material UI (MUI). **Obrigatório** para qualquer tela de gestão de entidades.

## Escopo de Aplicabilidade

Aplica-se a qualquer tela com fluxo CRUD:

- Gestão de cadastros e permissões
- Gestão de entidades relacionais
- Gestão de atendimento e operações
- Gestão de configurações e parametrizações
- Qualquer outro módulo com fluxo CRUD

---

## 1. Visão Geral

As telas de gestão devem manter consistência de layout, hierarquia, interação e acessibilidade. O padrão prioriza:

- Cabeçalho de contexto (breadcrumbs + título + ação primária)
- Busca e filtros rápidos
- Lista em tabela com ações por linha
- Formulário em modal com validação clara
- Feedback de operações e estados de carregamento

---

## 2. Componentes Principais (Material UI)

Todos os exemplos usam componentes reais de `@mui/material` e `@mui/x-data-grid`.

### 2.1 DataGrid / Table

- Tabela responsiva ocupando 100% da largura.
- Paginação padrão: `pageSizeOptions={[10, 25, 50]}`.
- Colunas definidas por `GridColDef[]`.
- Ações em menu de três pontinhos por linha.
- Ordenação inicial por `created_at desc`.
- **Regra obrigatória:** registro recém-criado aparece no topo da listagem.

```tsx
const columns: GridColDef[] = [
  { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 180 },
  { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 220 },
  {
    field: 'acoes',
    headerName: 'Ações',
    minWidth: 64,
    maxWidth: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: () => (
      <IconButton size="small" aria-label="Ações da linha">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    ),
  },
]

<DataGrid
  rows={rows}
  columns={columns}
  pageSizeOptions={[10, 25, 50]}
  density="comfortable"
  getRowHeight={() => 'auto'}
  initialState={{ sorting: { sortModel: [{ field: 'created_at', sort: 'desc' }] } }}
  disableRowSelectionOnClick
  sx={{ width: '100%' }}
/>
```

### 2.2 Botões e Ações

- Botão primário de criação: `contained` com `startIcon`.
- Ações por linha: `IconButton` + `Menu` + `MenuItem`.
- Cores semânticas:
  - Editar: `primary`
  - Excluir: `error`

```tsx
<Button variant="contained" startIcon={<AddIcon />}>Criar Entidade</Button>

<Menu anchorEl={anchorEl} open={open} onClose={onClose}>
  <MenuItem>
    <ListItemIcon><EditIcon fontSize="small" color="primary" /></ListItemIcon>
    Editar
  </MenuItem>
  <MenuItem sx={{ color: 'error.main' }}>
    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
    Excluir
  </MenuItem>
</Menu>
```

### 2.3 Dialog / Modal

- Estrutura: `DialogTitle` + `DialogContent` + `DialogActions`.
- `maxWidth="sm"` e `fullWidth` por padrão.
- Fechamento por cancelar, backdrop ou ESC.
- Erros de validação no topo do conteúdo com `Alert`.

```tsx
<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
  <DialogTitle>{isEditing ? 'Editar Entidade' : 'Nova Entidade'}</DialogTitle>
  <DialogContent dividers>
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}
    <Grid container spacing={2}>
      {/* campos */}
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button onClick={onClose}>Cancelar</Button>
    <Button variant="contained">Salvar</Button>
  </DialogActions>
</Dialog>
```

### 2.4 Formulário (TextField / Select)

- Campos com `variant="outlined"`, `fullWidth`, `size="small"`.
- Obrigatoriedade clara no label (ex.: `"Nome *"`).
- `TextField select` + `MenuItem` para listas simples.
- `Autocomplete` quando houver busca/filtro avançado.

```tsx
<TextField label="Nome *" fullWidth size="small" value={form.nome} onChange={onNome} />

<TextField label="Categoria *" select fullWidth size="small" value={form.categoria} onChange={onCategoria}>
  <MenuItem value="A">Categoria A</MenuItem>
  <MenuItem value="B">Categoria B</MenuItem>
</TextField>
```

### 2.5 Feedback e Loading

- Feedback de erro/aviso/sucesso com `Alert` inline.
- `Snackbar` opcional para feedback não bloqueante.
- Loading com `CircularProgress` para ações e carregamento de conteúdo.

```tsx
{
  error && <Alert severity="error">{error}</Alert>;
}

<Button variant="contained" disabled={saving}>
  {saving ? <CircularProgress size={20} /> : 'Salvar'}
</Button>;
```

### 2.6 Layout Base (Box / Stack / Paper / Grid)

- `Box` como wrapper de página.
- `Stack` no cabeçalho para responsividade.
- `Paper` para blocos de busca e tabela.
- `Grid` para distribuição de campos.

```tsx
<Box>
  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
    <Typography variant="h5" fontWeight={700} color="primary">
      Gestão de Entidades
    </Typography>
    <Button variant="contained" startIcon={<AddIcon />}>
      Criar Entidade
    </Button>
  </Stack>

  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
    <TextField fullWidth size="small" placeholder="Buscar..." />
  </Paper>
</Box>
```

### 2.7 Breadcrumbs

- Exibe contexto de navegação no topo.
- Itens anteriores clicáveis; item atual não clicável.
- Seção em uppercase acima da trilha (opcional).

```tsx
<Box sx={{ display: { xs: 'none', sm: 'block' }, mb: 2 }}>
  <Typography
    variant="caption"
    sx={{ textTransform: 'uppercase', letterSpacing: '0.09em', mb: 0.25 }}
  >
    CADASTRO
  </Typography>
  <Breadcrumbs aria-label="breadcrumb" separator="/">
    <Link component={RouterLink} to="/dashboard" underline="always">
      Home
    </Link>
    <Typography fontWeight={700}>Entidades</Typography>
  </Breadcrumbs>
</Box>
```

### 2.8 Menu Lateral (Sidebar)

- Navegação primária com `Drawer`.
- Desktop: `variant="permanent"`. Mobile: `variant="temporary"`.
- Submenus com `Collapse`.
- Estado ativo com destaque visual.

```tsx
<Drawer
  variant="permanent"
  open
  sx={{ '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
>
  <List disablePadding>
    <ListItem disablePadding>
      <ListItemButton selected>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </ListItem>
  </List>
</Drawer>
```

---

## 3. Layout e Tamanhos

- Container principal: `maxWidth: 1200px`, centralizado.
- Espaçamento entre seções: `24px`.
- Espaçamento entre campos: `16px` vertical, `8px` horizontal.
- Botão de ação primária no cabeçalho.
- Tabela dentro de `Paper` com `overflowX: auto`.
- Responsividade obrigatória em breakpoints `xs`, `sm`, `md`.

---

## 4. Padrões de Interação

- Ações por linha via menu de três pontinhos.
- **Exclusão sempre com confirmação explícita.**
- Feedback imediato após ação (erro/sucesso/aviso).
- Loading em operações assíncronas.
- Recarregamento de listagem após criação/edição/exclusão.
- Novo registro deve aparecer no topo.

```tsx
function handleSucessoCriacao() {
  setModalAberto(false);
  recarregar();
}
```

---

## 5. Acessibilidade (Obrigatório)

- Todo ícone interativo deve ter `aria-label`.
- Use `Tooltip` em ações iconográficas — ver skill `mui-tooltip-disabled` para elementos desabilitados.
- Contraste mínimo WCAG AA.
- Navegação por teclado com foco visível.
- Labels claros em todos os campos de formulário.

```tsx
<Tooltip title="Abrir ações">
  <IconButton aria-label="Ações do registro" size="small">
    <MoreVertIcon fontSize="small" />
  </IconButton>
</Tooltip>
```

---

## 6. Tokens de Interface

| Token                               | Valor                 |
| ----------------------------------- | --------------------- |
| Largura de conteúdo                 | `maxWidth: 1200px`    |
| Espaçamentos base                   | `8`, `16`, `24`, `32` |
| Densidade padrão de tabela          | `comfortable`         |
| Ação primária                       | `primary`             |
| Ação de atenção                     | `warning`             |
| Ação destrutiva                     | `error`               |
| Elevação — blocos utilitários       | `elevation={1}`       |
| Elevação — bloco principal (tabela) | `elevation={2}`       |

---

## 7. Checklist de Conformidade (PR)

Antes de aprovar uma nova tela de gestão, validar:

- [ ] Breadcrumbs presentes no topo (quando aplicável)
- [ ] Cabeçalho com título + ação primária
- [ ] Busca/filtros rápidos
- [ ] Tabela com paginação `10/25/50`
- [ ] Ações por linha no menu `[⋮]`
- [ ] Modal com estrutura `Title/Content/Actions`
- [ ] Feedback de erro/sucesso e estados de loading
- [ ] Novo registro aparecendo no topo
- [ ] Acessibilidade mínima (`aria-label`, foco, contraste)
- [ ] Responsividade em `xs/sm/md`

> **Vinculativo:** Exceções só devem ocorrer com aprovação arquitetural explícita.

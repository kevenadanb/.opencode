---
name: ui-ux-design-system
description: >
  Especialista em UI/UX e padronização visual de telas com Material UI. Use quando:
  criar telas de gestão CRUD, revisar componentes MUI, aplicar design system,
  verificar acessibilidade de interface, padronizar layouts, DataGrid, modais,
  formulários, breadcrumbs, sidebar, feedback de loading/erro, tokens de interface,
  checklist de conformidade de PR.
---

# UI/UX Design System

## 🎯 Objetivo

Garantir que toda interface siga os padrões de Design System de cada projeto, mantendo consistência visual, acessibilidade (WCAG AA) e código MUI limpo.

> Os valores de token abaixo são **exemplo de estrutura**, não valores fixos. Cada projeto define os seus próprios em `theme.ts`/`ThemeContext` (ver skill `context-tema`); use os tokens reais do projeto atual, nunca os valores de exemplo abaixo.

---

## 🎨 Tokens Visuais (estrutura de exemplo — use os valores reais do projeto)

| Token | Exemplo | Uso |
|-------|-------|-----|
| `primary.main` | `#1565C0` | Botões primários, destaques |
| `secondary.main` | `#00897B` | Ações secundárias, badges |
| `error.main` | `#C62828` | Erros, exclusão |
| `warning.main` | `#F57F17` | Alertas, pendentes |
| `success.main` | `#2E7D32` | Confirmações, ativo |
| `background.default` | `#F5F7FA` | Fundo de página |
| `background.paper` | `#FFFFFF` | Cards, modais |
| `text.primary` | `#1A1A2E` | Texto principal |
| `text.secondary` | `#5C6B7A` | Labels, subtítulos |
| Spacing base | `8px` | `theme.spacing(1)` = 8px |
| Border radius | `8px` cards, `4px` inputs | — |
| Font family | `Inter, sans-serif` | — |
| Font sizes | `h1:32`, `h2:24`, `h3:20`, `body1:16`, `body2:14`, `caption:12` | — |

---

## 📐 Layout Padrão de Tela

```tsx
// Estrutura obrigatória para toda tela de gestão
<Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
  {/* 1. Breadcrumbs */}
  <Breadcrumbs sx={{ mb: 2 }} />

  {/* 2. Header com título + ação primária */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Box>
      <Typography variant="h4">{titulo}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitulo}</Typography>
    </Box>
    <Button variant="contained" startIcon={<AddIcon />}>Nova Ação</Button>
  </Box>

  {/* 3. Filtros (se aplicável) */}
  <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
    {/* filtros */}
  </Paper>

  {/* 4. Conteúdo principal */}
  <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
    {/* DataGrid ou conteúdo */}
  </Paper>
</Box>
```

---

## 📊 DataGrid — Padrão Obrigatório

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  loading={isLoading}
  autoHeight
  disableRowSelectionOnClick
  pageSizeOptions={[10, 25, 50]}
  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
  localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
  sx={{
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'grey.50',
      fontWeight: 600,
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'action.hover',
    },
  }}
  slots={{ toolbar: CustomToolbar, noRowsOverlay: EmptyState }}
/>
```

### Coluna de Ações (padrão)

```tsx
{
  field: 'acoes',
  headerName: 'Ações',
  width: 120,
  sortable: false,
  renderCell: ({ row }) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="Editar">
        <IconButton size="small" onClick={() => onEdit(row)} aria-label="editar">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton size="small" color="error" onClick={() => onDelete(row)} aria-label="excluir">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  ),
}
```

---

## 💬 Dialogs (Modais)

```tsx
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {titulo}
      <IconButton onClick={onClose} size="small" aria-label="fechar">
        <CloseIcon />
      </IconButton>
    </Box>
  </DialogTitle>
  <Divider />
  <DialogContent sx={{ pt: 3 }}>
    {/* formulário */}
  </DialogContent>
  <Divider />
  <DialogActions sx={{ p: 2, gap: 1 }}>
    <Button variant="outlined" onClick={onClose} disabled={isLoading}>Cancelar</Button>
    <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
      {isLoading ? <CircularProgress size={20} /> : 'Salvar'}
    </Button>
  </DialogActions>
</Dialog>
```

---

## 📝 Formulários

```tsx
// Campo de texto padrão
<TextField
  label="Nome"
  fullWidth
  size="small"
  error={!!errors.nome}
  helperText={errors.nome?.message}
  {...register('nome')}
/>

// Select padrão
<FormControl fullWidth size="small" error={!!errors.tipo}>
  <InputLabel>Tipo</InputLabel>
  <Select label="Tipo" {...register('tipo')}>
    <MenuItem value="opcao1">Opção 1</MenuItem>
  </Select>
  {errors.tipo && <FormHelperText>{errors.tipo.message}</FormHelperText>}
</FormControl>
```

**Grid de formulário:**
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>{/* campo */}</Grid>
  <Grid item xs={12} sm={6}>{/* campo */}</Grid>
  <Grid item xs={12}>{/* campo full width */}</Grid>
</Grid>
```

---

## 🔔 Feedback ao Usuário

```tsx
// Snackbar de sucesso
<Snackbar open={open} autoHideDuration={4000} onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
  <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }}>
    Operação realizada com sucesso!
  </Alert>
</Snackbar>

// Estados de loading
{isLoading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress />
  </Box>
) : content}

// Estado vazio
<Box sx={{ textAlign: 'center', py: 8 }}>
  <Typography variant="h6" color="text.secondary">Nenhum item encontrado</Typography>
  <Button variant="contained" sx={{ mt: 2 }}>Adicionar primeiro</Button>
</Box>
```

---

## 🗂️ Breadcrumbs

```tsx
<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
  <Link component={RouterLink} to="/" color="inherit" underline="hover">
    <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
    Início
  </Link>
  <Link component={RouterLink} to="/modulo" color="inherit" underline="hover">
    Módulo
  </Link>
  <Typography color="text.primary">Tela Atual</Typography>
</Breadcrumbs>
```

---

## 🃏 Cards de Estatística (Dashboard)

```tsx
<Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
  <CardContent>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{
        p: 1.5, borderRadius: 2,
        backgroundColor: `${color}.light`,
        color: `${color}.main`,
      }}>
        <Icon />
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>{valor}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Box>
  </CardContent>
</Card>
```

---

## ✅ Checklist de Conformidade

Antes de qualquer PR, verificar:

### Layout
- [ ] Usa `Box` com `p: 3` e `background.default`
- [ ] Breadcrumbs presente em telas de gestão
- [ ] Header com título + botão de ação alinhados (space-between)

### DataGrid
- [ ] `autoHeight` e `disableRowSelectionOnClick` habilitados
- [ ] `localeText={ptBR...}` aplicado
- [ ] Slot `noRowsOverlay` definido
- [ ] Coluna de ações com `IconButton` + `Tooltip` + `aria-label`

### Formulário
- [ ] `size="small"` em todos os campos
- [ ] `error` e `helperText` conectados ao React Hook Form
- [ ] Grid `container spacing={2}` para layout responsivo

### Dialog
- [ ] `maxWidth="sm"` e `fullWidth`
- [ ] `Divider` entre título/conteúdo e conteúdo/ações
- [ ] Botão fechar com `aria-label="fechar"`
- [ ] Botão salvar com `CircularProgress` no loading

### Acessibilidade
- [ ] Todos `IconButton` têm `aria-label`
- [ ] Inputs têm `label` associado
- [ ] Contraste mínimo 4.5:1
- [ ] Navegação por teclado funcional

### Tokens
- [ ] Usa variáveis do tema (`primary.main`, `text.secondary`, etc.)
- [ ] Sem cores hardcoded (`#hex` direto no `sx`)
- [ ] `borderRadius: 2` para cards/papers (= 8px)

---

## 🔧 Workflow ao Aplicar Esta Skill

1. **Auditar** — Use `browser_snapshot` para capturar estado atual da tela
2. **Identificar desvios** — Comparar com checklist acima
3. **Buscar docs MUI** — Use `mui-mcp_useMuiDocs` para props/exemplos atualizados
4. **Implementar** — Seguir padrões desta skill
5. **Validar** — Tirar screenshot final, verificar checklist, confirmar acessibilidade

---

## 📎 Referências

- [Design System completo](./references/design-system.md)
- [Template CRUD](./assets/crud-screen-template.tsx)
- Documentação MUI: use `#mui-mcp/*` para consultar

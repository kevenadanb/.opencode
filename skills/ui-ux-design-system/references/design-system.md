# Design System — Quick Reference

## Tokens de Cor

```ts
const theme = createTheme({
  palette: {
    primary:    { main: '#1565C0', light: '#E3F2FD', dark: '#0D47A1' },
    secondary:  { main: '#00897B', light: '#E0F2F1', dark: '#00695C' },
    error:      { main: '#C62828', light: '#FFEBEE' },
    warning:    { main: '#F57F17', light: '#FFFDE7' },
    success:    { main: '#2E7D32', light: '#E8F5E9' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    text:       { primary: '#1A1A2E', secondary: '#5C6B7A' },
    divider:    '#E0E7EF',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: '2rem',    fontWeight: 700 },
    h2: { fontSize: '1.5rem',  fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.75rem' },
  },
  shape: { borderRadius: 8 },
  spacing: 8,
});
```

---

## Componentes — Props Padrão

### Button
```tsx
// Primário
<Button variant="contained" startIcon={<Icon />}>Ação</Button>

// Secundário
<Button variant="outlined">Cancelar</Button>

// Perigo
<Button variant="contained" color="error">Excluir</Button>

// Com loading
<Button variant="contained" disabled={loading}>
  {loading ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
</Button>
```

### TextField
```tsx
<TextField
  label="Campo"
  fullWidth
  size="small"           // sempre small
  error={!!errors.campo}
  helperText={errors.campo?.message}
  InputLabelProps={{ shrink: true }}  // para datas/selects
  {...register('campo')}
/>
```

### DataGrid — Props Obrigatórias
```tsx
const GRID_PROPS = {
  autoHeight: true,
  disableRowSelectionOnClick: true,
  pageSizeOptions: [10, 25, 50],
  localeText: ptBR.components.MuiDataGrid.defaultProps.localeText,
  initialState: { pagination: { paginationModel: { pageSize: 10 } } },
  slots: { toolbar: CustomToolbar, noRowsOverlay: EmptyState },
};
```

### Chip de Status
```tsx
const STATUS_MAP = {
  ativo:     { label: 'Ativo',     color: 'success' },
  inativo:   { label: 'Inativo',   color: 'default' },
  pendente:  { label: 'Pendente',  color: 'warning' },
  cancelado: { label: 'Cancelado', color: 'error'   },
};

<Chip
  label={STATUS_MAP[status].label}
  color={STATUS_MAP[status].color}
  size="small"
  variant="outlined"
/>
```

---

## Padrões de Spacing

| Uso | Valor sx |
|-----|----------|
| Padding de página | `p: 3` (24px) |
| Gap entre seções | `mb: 3` (24px) |
| Padding de card/paper | `p: 2` (16px) |
| Gap entre campos de form | `spacing={2}` no Grid |
| Gap entre botões | `gap: 1` (8px) |

---

## Paper / Card Padrão

```tsx
// Paper de conteúdo
<Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>

// Paper de filtros
<Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>

// Card de estatística
<Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
```

---

## Acessibilidade — Checklist Rápido

- [ ] `aria-label` em todo `IconButton`
- [ ] `<label>` ou `InputLabel` associado a inputs
- [ ] `role="status"` em mensagens dinâmicas
- [ ] Foco visível (não remover outline)
- [ ] Tab order lógico em formulários
- [ ] `aria-busy="true"` em containers com loading
- [ ] Contraste mínimo 4.5:1 (texto normal) / 3:1 (texto grande)

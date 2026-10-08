/**
 * @name CrudScreenTemplate
 * @description Template completo para telas de gestão CRUD
 * seguindo os padrões do Design System da Clínica Mundos.
 *
 * Como usar:
 * 1. Copie este arquivo para src/components/pages/[Modulo]/Listar[Entidades]/
 * 2. Renomeie Entidade → nome real (ex: Paciente, Profissional)
 * 3. Substitua os campos do formulário pelos campos reais
 * 4. Conecte ao serviço real em useListarEntidades
 */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Entidade {
  id: number;
  nome: string;
  status: 'ativo' | 'inativo';
  // adicione seus campos aqui
}

interface FormData {
  nome: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Status map
// ---------------------------------------------------------------------------
const STATUS_MAP = {
  ativo: { label: 'Ativo', color: 'success' as const },
  inativo: { label: 'Inativo', color: 'default' as const },
};

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary">
        Nenhum registro encontrado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Clique em "Nova Entidade" para adicionar o primeiro registro.
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function ListarEntidades() {
  const [rows] = useState<Entidade[]>([]);
  const [isLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Entidade | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [form, setForm] = useState<FormData>({ nome: '', status: 'ativo' });

  const handleOpenCreate = () => {
    setSelectedRow(null);
    setForm({ nome: '', status: 'ativo' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (row: Entidade) => {
    setSelectedRow(row);
    setForm({ nome: row.nome, status: row.status });
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: chamar serviço real
      // selectedRow ? await entidadeService.update(selectedRow.id, form) : await entidadeService.create(form);
      setSnackbar({ open: true, message: 'Salvo com sucesso!', severity: 'success' });
      handleClose();
    } catch {
      setSnackbar({ open: true, message: 'Erro ao salvar. Tente novamente.', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nome', headerName: 'Nome', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={STATUS_MAP[value as keyof typeof STATUS_MAP]?.label ?? value}
          color={STATUS_MAP[value as keyof typeof STATUS_MAP]?.color ?? 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} aria-label="editar">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" aria-label="excluir">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          <HomeIcon sx={{ mr: 0.5, fontSize: 16, verticalAlign: 'middle' }} />
          Início
        </Link>
        <Link component={RouterLink} to="/modulo" color="inherit" underline="hover">
          Módulo
        </Link>
        <Typography color="text.primary">Entidades</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Entidades
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os registros do sistema
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Nova Entidade
        </Button>
      </Box>

      {/* DataGrid */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
            '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.50', fontWeight: 600 },
            '& .MuiDataGrid-row:hover': { backgroundColor: 'action.hover' },
          }}
          slots={{ noRowsOverlay: EmptyState }}
        />
      </Paper>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedRow ? 'Editar Entidade' : 'Nova Entidade'}
            <IconButton onClick={handleClose} size="small" aria-label="fechar">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                fullWidth
                size="small"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

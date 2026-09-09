import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { EmptyState } from '@/components/EmptyState'
import type { AllergyCatalog } from '../types'

interface AllergyCatalogTableProps {
  items: AllergyCatalog[]
  typeNameById: Map<number, string>
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre', 'Tipo', 'Estado', '']

export function AllergyCatalogTable({
  items,
  typeNameById,
  onEdit,
  onToggleActive,
}: AllergyCatalogTableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron alergias con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header) => (
              <TableCell key={header} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              <TableCell>
                <Chip
                  label={typeNameById.get(item.typeId) ?? '—'}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.active ? 'Activa' : 'Inactiva'}
                  size="small"
                  color={item.active ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => onEdit(item.id)} aria-label="Editar alergia">
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={item.active ? 'Desactivar' : 'Activar'}>
                  <IconButton
                    size="small"
                    onClick={() => onToggleActive(item.id)}
                    aria-label="Cambiar estado de la alergia"
                  >
                    <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

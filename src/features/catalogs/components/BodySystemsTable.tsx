import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { EmptyState } from '@/components/EmptyState'
import type { BodySystem } from '../types'

interface BodySystemsTableProps {
  items: BodySystem[]
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

export function BodySystemsTable({ items, onEdit, onToggleActive }: BodySystemsTableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron aparatos/sistemas con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Nombre</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Código corto</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Capítulo CIE-10</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Estado</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.shortCode}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.cie10Chapter ?? '—'}</TableCell>
              <TableCell>
                <Chip label={item.active ? 'Activo' : 'Inactivo'} size="small" color={item.active ? 'success' : 'default'} />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => onEdit(item.id)} aria-label="Editar aparato/sistema">
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={item.active ? 'Desactivar' : 'Activar'}>
                  <IconButton size="small" onClick={() => onToggleActive(item.id)} aria-label="Cambiar estado">
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

import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip, IconButton, Tooltip } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { EmptyState } from '@/components/EmptyState'

interface SimpleCatalogItem {
  id: number
  name: string
  active: boolean
  isoCode?: string
}

interface SimpleCatalogTableProps {
  items: SimpleCatalogItem[]
  showIsoCode?: boolean
  onToggleActive: (id: number) => void
}

export function SimpleCatalogTable({ items, showIsoCode, onToggleActive }: SimpleCatalogTableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron elementos con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Nombre</TableCell>
            {showIsoCode && (
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Código ISO</TableCell>
            )}
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Estado</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              {showIsoCode && <TableCell sx={{ fontSize: '14px' }}>{item.isoCode}</TableCell>}
              <TableCell>
                <Chip label={item.active ? 'Activo' : 'Inactivo'} size="small" color={item.active ? 'success' : 'default'} />
              </TableCell>
              <TableCell align="right">
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

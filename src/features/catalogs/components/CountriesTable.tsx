import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { EmptyState } from '@/components/EmptyState'
import type { Country } from '../types'

interface CountriesTableProps {
  items: Country[]
  onEdit: (item: Country) => void
}

export function CountriesTable({ items, onEdit }: CountriesTableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron países con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Nombre</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Código ISO</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.isoCode}</TableCell>
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => onEdit(item)} aria-label="Editar país">
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
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

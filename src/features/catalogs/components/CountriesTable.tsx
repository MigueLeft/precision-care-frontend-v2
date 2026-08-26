import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import type { Country } from '../types'

interface CountriesTableProps {
  items: Country[]
}

export function CountriesTable({ items }: CountriesTableProps) {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.isoCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

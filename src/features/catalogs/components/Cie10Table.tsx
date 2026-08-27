import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import type { Cie10Entry } from '../types'

interface Cie10TableProps {
  items: Cie10Entry[]
  bodySystemNameById: Map<number, string>
}

export function Cie10Table({ items, bodySystemNameById }: Cie10TableProps) {
  if (items.length === 0) {
    return <EmptyState message="No se encontraron códigos CIE-10 con los filtros actuales." />
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Código</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Descripción</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Capítulo</TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Aparato / sistema</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.code} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{item.code}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.description}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>{item.chapter ?? '—'}</TableCell>
              <TableCell sx={{ fontSize: '14px' }}>
                {item.bodySystemId ? (bodySystemNameById.get(item.bodySystemId) ?? '—') : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { ParaclinicalRow } from './ParaclinicalRow'
import type { ParaclinicalCatalog } from '../types'

interface ParaclinicalsTableProps {
  paraclinicals: ParaclinicalCatalog[]
  categoryNameById: Map<number, string>
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre', 'Categoría', 'Unidad', 'Referencia', 'Estado', '']

export function ParaclinicalsTable({
  paraclinicals,
  categoryNameById,
  onEdit,
  onToggleActive,
}: ParaclinicalsTableProps) {
  if (paraclinicals.length === 0) {
    return (
      <EmptyState message="No se encontraron paraclínicos con los filtros actuales." />
    )
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
          {paraclinicals.map((paraclinical) => (
            <ParaclinicalRow
              key={paraclinical.id}
              paraclinical={paraclinical}
              categoryNameById={categoryNameById}
              onEdit={() => onEdit(paraclinical.id)}
              onToggleActive={() => onToggleActive(paraclinical.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

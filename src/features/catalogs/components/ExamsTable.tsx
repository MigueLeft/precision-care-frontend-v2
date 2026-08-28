import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { ExamRow } from './ExamRow'
import type { ExamCatalog } from '../types'

interface ExamsTableProps {
  exams: ExamCatalog[]
  categoryNameById: Map<number, string>
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre', 'Categoría', 'Unidad', 'Referencia', 'Estado', '']

export function ExamsTable({ exams, categoryNameById, onEdit, onToggleActive }: ExamsTableProps) {
  if (exams.length === 0) {
    return <EmptyState message="No se encontraron exámenes con los filtros actuales." />
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
          {exams.map((exam) => (
            <ExamRow
              key={exam.id}
              exam={exam}
              categoryNameById={categoryNameById}
              onEdit={() => onEdit(exam.id)}
              onToggleActive={() => onToggleActive(exam.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

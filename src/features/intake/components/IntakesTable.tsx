import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { IntakeRow } from './IntakeRow'
import type { Intake } from '../types'

interface IntakesTableProps {
  intakes: Intake[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const HEADERS = ['Nombre', 'Tipo', 'Versión', 'Estado', '']

export function IntakesTable({ intakes, onEdit, onDelete }: IntakesTableProps) {
  if (intakes.length === 0) {
    return <EmptyState message="No se encontraron ingresables con los filtros actuales." />
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
          {intakes.map((intake) => (
            <IntakeRow
              key={intake.id}
              intake={intake}
              onEdit={() => onEdit(intake.id)}
              onDelete={() => onDelete(intake.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

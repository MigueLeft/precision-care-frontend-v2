import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { MedicationRow } from './MedicationRow'
import type { Medication } from '../types'

interface MedicationsTableProps {
  medications: Medication[]
  onEdit: (id: number) => void
  onToggleActive: (id: number) => void
}

const HEADERS = ['Nombre comercial', 'Sustancia activa', 'Presentación', 'Concentración', 'Categoría', 'Estado', '']

export function MedicationsTable({ medications, onEdit, onToggleActive }: MedicationsTableProps) {
  if (medications.length === 0) {
    return <EmptyState message="No se encontraron medicamentos con los filtros actuales." />
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
          {medications.map((medication) => (
            <MedicationRow
              key={medication.id}
              medication={medication}
              onEdit={() => onEdit(medication.id)}
              onToggleActive={() => onToggleActive(medication.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { formatMonthYear } from '@/utils/format-date'
import type { PatientMedication } from '../types'
import { getMedicationDisplayName } from '../utils/medication-helpers'

interface PreviousMedicationsTableProps {
  medications: PatientMedication[]
}

const HEADERS = ['Medicamento', 'Dosis', 'Frecuencia', 'Hasta', 'Motivo de suspensión']

export function PreviousMedicationsTable({ medications }: PreviousMedicationsTableProps) {
  if (medications.length === 0) {
    return <EmptyState message="Sin medicamentos previos." />
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header) => (
              <TableCell
                key={header}
                sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {getMedicationDisplayName(medication)}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {medication.concentration ?? '—'}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                {medication.frequency ?? '—'}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {formatMonthYear(medication.endAt)}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                {medication.discontinuationReason ?? '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

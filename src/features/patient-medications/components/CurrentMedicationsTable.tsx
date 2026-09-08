import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { formatMonthYear } from '@/utils/format-date'
import type { PatientMedication } from '../types'
import { getMedicationDisplayName } from '../utils/medication-helpers'

interface CurrentMedicationsTableProps {
  medications: PatientMedication[]
  onSuspend: (medication: PatientMedication) => void
}

const HEADERS = ['Medicamento', 'Dosis', 'Frecuencia', 'Desde', '']

export function CurrentMedicationsTable({
  medications,
  onSuspend,
}: CurrentMedicationsTableProps) {
  if (medications.length === 0) {
    return <EmptyState message="Sin medicamentos activos." />
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {HEADERS.map((header, index) => (
              <TableCell
                key={`${header}-${index}`}
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
              <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                {getMedicationDisplayName(medication)}
              </TableCell>
              <TableCell sx={{ fontSize: '13px' }}>
                {medication.concentration ?? '—'}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                {medication.frequency ?? '—'}
              </TableCell>
              <TableCell sx={{ fontSize: '13px' }}>
                {formatMonthYear(medication.startAt)}
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  color="error"
                  onClick={() => onSuspend(medication)}
                  sx={{ px: 1 }}
                >
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>Suspender</Typography>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

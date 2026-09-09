import { Fragment } from 'react'
import {
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { formatShortDate } from '@/utils/format-date'
import type { PatientMedication } from '../types'
import {
  getMedicationDisplayName,
  ADHERENCE_LABELS,
  RAM_LABELS,
} from '../utils/medication-helpers'

interface CurrentMedicationsTableProps {
  medications: PatientMedication[]
  onSuspend: (medication: PatientMedication) => void
}

const HEADERS = ['Medicamento', 'Dosis', 'Frecuencia', 'Desde', 'Prescriptor', '']

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
          {medications.map((medication) => {
            const notes = [medication.adherenceNotes, medication.ramNotes].filter(Boolean)
            const hasCapture =
              medication.adherence != null ||
              (medication.ramStatus != null && medication.ramStatus !== 'none') ||
              notes.length > 0
            return (
              <Fragment key={medication.id}>
                <TableRow sx={hasCapture ? { '& td': { borderBottom: 0 } } : undefined}>
                  <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {getMedicationDisplayName(medication)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {medication.dose ?? medication.concentration ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                    {medication.frequency ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {formatShortDate(medication.startAt)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {medication.prescriberName ?? '—'}
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
                {hasCapture && (
                  <TableRow>
                    <TableCell colSpan={HEADERS.length} sx={{ pt: 0, pb: 1 }}>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                        {medication.adherence && (
                          <Chip size="small" label={`Adherencia: ${ADHERENCE_LABELS[medication.adherence]}`} />
                        )}
                        {medication.ramStatus && medication.ramStatus !== 'none' && (
                          <Chip
                            size="small"
                            color={medication.ramStatus === 'confirmed' ? 'error' : 'warning'}
                            label={`RAM: ${RAM_LABELS[medication.ramStatus]}`}
                          />
                        )}
                        {notes.length > 0 && (
                          <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
                            {notes.join(' · ')}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

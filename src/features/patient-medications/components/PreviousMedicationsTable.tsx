import { Fragment, useState } from 'react'
import {
  Box,
  Collapse,
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

interface PreviousMedicationsTableProps {
  medications: PatientMedication[]
}

const HEADERS = ['Medicamento', 'Dosis', 'Frecuencia', 'Hasta', 'Motivo de suspensión']

export function PreviousMedicationsTable({ medications }: PreviousMedicationsTableProps) {
  const [openId, setOpenId] = useState<number | null>(null)

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
          {medications.map((medication) => {
            const notes = [medication.adherenceNotes, medication.ramNotes].filter(Boolean)
            const hasNotes = notes.length > 0
            const isOpen = openId === medication.id
            return (
              <Fragment key={medication.id}>
                <TableRow
                  hover={hasNotes}
                  sx={{ cursor: hasNotes ? 'pointer' : 'default' }}
                  onClick={() => hasNotes && setOpenId(isOpen ? null : medication.id)}
                >
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                    {getMedicationDisplayName(medication)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                    {medication.dose ?? medication.concentration ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                    {medication.frequency ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                    {formatMonthYear(medication.endAt)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                    {medication.discontinuationReason ?? '—'}
                    {hasNotes && (
                      <Typography component="span" sx={{ fontSize: '11px', color: 'primary.main', ml: 1 }}>
                        {isOpen ? 'ocultar notas' : 'ver notas'}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
                {hasNotes && (
                  <TableRow>
                    <TableCell colSpan={HEADERS.length} sx={{ py: 0, border: 0 }}>
                      <Collapse in={isOpen} unmountOnExit>
                        <Box sx={{ py: 1.5, px: 1 }}>
                          {notes.map((note, index) => (
                            <Typography
                              key={index}
                              sx={{ fontSize: '13px', fontStyle: 'italic', color: 'text.secondary' }}
                            >
                              {note}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
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

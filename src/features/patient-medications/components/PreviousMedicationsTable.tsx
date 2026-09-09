import { Fragment, useState } from 'react'
import {
  Box,
  Chip,
  Collapse,
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

interface PreviousMedicationsTableProps {
  medications: PatientMedication[]
}

const HEADERS = ['Medicamento', 'Dosis', 'Frecuencia', 'Hasta', 'Motivo de suspensión', '']

function Detail({ medication }: { medication: PatientMedication }) {
  return (
    <Stack spacing={0.5} sx={{ py: 1.25, px: 1 }}>
      <Typography sx={{ fontSize: '13px' }}>
        <Box component="span" sx={{ fontWeight: 600 }}>
          Motivo:
        </Box>{' '}
        {medication.discontinuationReason ?? 'No especificado'}
      </Typography>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
        Desde {formatShortDate(medication.startAt)} hasta {formatShortDate(medication.endAt)}
      </Typography>
      {(medication.adherence || (medication.ramStatus && medication.ramStatus !== 'none')) && (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
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
        </Stack>
      )}
      {[medication.adherenceNotes, medication.ramNotes].filter(Boolean).map((note, index) => (
        <Typography key={index} sx={{ fontSize: '13px', fontStyle: 'italic', color: 'text.secondary' }}>
          {note}
        </Typography>
      ))}
    </Stack>
  )
}

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
            const isOpen = openId === medication.id
            return (
              <Fragment key={medication.id}>
                <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => setOpenId(isOpen ? null : medication.id)}>
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
                    {formatShortDate(medication.endAt)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                    {medication.discontinuationReason ?? '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600 }}>
                      {isOpen ? 'Ocultar' : 'Ver detalle'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={HEADERS.length} sx={{ py: 0, border: 0 }}>
                    <Collapse in={isOpen} unmountOnExit>
                      <Detail medication={medication} />
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

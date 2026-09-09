import { useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import {
  ADHERENCE_COLORS,
  ADHERENCE_LABELS,
  RAM_COLORS,
  RAM_LABELS,
} from '../../utils/consultation-format'
import { useConsultationMedicationHistory } from '../../hooks/useConsultationMedications'
import type { MedicationHistoryItem } from '../../types'

interface MedicationHistoryProps {
  consultationId: number
}

function medname(item: MedicationHistoryItem) {
  return item.brandName ?? item.genericName ?? 'Medicamento'
}

export function MedicationHistory({ consultationId }: MedicationHistoryProps) {
  const { data: history = [] } = useConsultationMedicationHistory(consultationId)
  const [expanded, setExpanded] = useState(false)

  if (history.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary' }}>
          Histórico · {history.length}{' '}
          {history.length === 1 ? 'consulta anterior' : 'consultas anteriores'}
        </Typography>
        <Typography
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
        >
          {expanded ? 'Ocultar' : 'Ver'}
        </Typography>
      </Stack>

      {expanded && (
        <Stack spacing={1.25} sx={{ mt: 1 }}>
          {history.map((entry) => (
            <Box key={entry.consultationId}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {formatShortDate(entry.date)}
                {entry.specialistName ? ` · ${entry.specialistName}` : ''}
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                {entry.items.map((item, index) => (
                  <Box key={`${entry.consultationId}-${index}`}>
                    <Typography sx={{ fontSize: '13px' }}>
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {medname(item)}
                      </Box>
                      {item.dose ? ` ${item.dose}` : ''}
                      {item.frequency ? ` · ${item.frequency}` : ''}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.25, flexWrap: 'wrap' }}>
                      {item.adherence && (
                        <Chip
                          size="small"
                          color={ADHERENCE_COLORS[item.adherence]}
                          label={`Adherencia: ${ADHERENCE_LABELS[item.adherence]}`}
                        />
                      )}
                      {item.ramStatus && (
                        <Chip
                          size="small"
                          color={RAM_COLORS[item.ramStatus]}
                          label={`RAM: ${RAM_LABELS[item.ramStatus]}`}
                        />
                      )}
                    </Stack>
                    {(item.adherenceNotes || item.ramNotes) && (
                      <Typography
                        sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary', mt: 0.25 }}
                      >
                        {[item.adherenceNotes, item.ramNotes].filter(Boolean).join(' · ')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

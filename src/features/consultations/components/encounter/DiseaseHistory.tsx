import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { DISEASE_STATUS_LABELS } from '../../utils/consultation-format'
import { useConsultationDiseaseHistory } from '../../hooks/useConsultationDiseases'

interface DiseaseHistoryProps {
  consultationId: number
}

export function DiseaseHistory({ consultationId }: DiseaseHistoryProps) {
  const { data: history = [] } = useConsultationDiseaseHistory(consultationId)
  const [expanded, setExpanded] = useState(false)

  if (history.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary' }}>
          Histórico · {history.length}{' '}
          {history.length === 1 ? 'revisión anterior' : 'revisiones anteriores'}
        </Typography>
        <Typography
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
        >
          {expanded ? 'Ocultar' : 'Ver'}
        </Typography>
      </Stack>

      {expanded && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          {history.map((entry) => (
            <Box key={entry.consultationId}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {formatShortDate(entry.date)}
                {entry.specialistName ? ` · ${entry.specialistName}` : ''}
              </Typography>
              <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                {entry.items.map((item, index) => (
                  <Typography
                    key={`${entry.consultationId}-${index}`}
                    sx={{ fontSize: '13px' }}
                  >
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {item.name ?? '—'}
                    </Box>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      {item.bodySystemName ? ` · ${item.bodySystemName}` : ''} ·{' '}
                      {DISEASE_STATUS_LABELS[item.status]}
                    </Box>
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

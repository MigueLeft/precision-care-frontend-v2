import { useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationAllergyHistory } from '../../hooks/useConsultationAllergies'

interface AllergyHistoryProps {
  consultationId: number
}

export function AllergyHistory({ consultationId }: AllergyHistoryProps) {
  const { data: history = [] } = useConsultationAllergyHistory(consultationId)
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
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 0.5 }}>
                {entry.items.map((item, index) => (
                  <Chip
                    key={`${entry.consultationId}-${index}`}
                    size="small"
                    variant="outlined"
                    label={
                      <>
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {item.name ?? '—'}
                        </Box>
                        {item.severityName ? (
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            {' '}
                            · {item.severityName}
                          </Box>
                        ) : null}
                      </>
                    }
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

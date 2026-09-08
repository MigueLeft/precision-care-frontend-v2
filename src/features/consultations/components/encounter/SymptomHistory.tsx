import { useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationSymptomHistory } from '../../hooks/useConsultationDetail'

interface SymptomHistoryProps {
  consultationId: number
  /** Nombres (lowercase) capturados en esta consulta, para marcar seguimiento. */
  currentNames: Set<string>
}

export function SymptomHistory({ consultationId, currentNames }: SymptomHistoryProps) {
  const { data: history = [] } = useConsultationSymptomHistory(consultationId)
  const [expanded, setExpanded] = useState(true)

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
          {expanded ? 'Ocultar' : 'Mostrar'}
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
                {entry.symptoms.map((symptom, index) => {
                  const persisting =
                    !!symptom.name &&
                    currentNames.has(symptom.name.toLowerCase())
                  return (
                    <Chip
                      key={`${entry.consultationId}-${index}`}
                      size="small"
                      variant="outlined"
                      label={
                        <>
                          <Box
                            component="span"
                            sx={{ fontWeight: persisting ? 700 : 400 }}
                          >
                            {symptom.name ?? '—'}
                          </Box>
                          {symptom.bodySystemName ? (
                            <Box component="span" sx={{ color: 'text.secondary' }}>
                              {' '}
                              · {symptom.bodySystemName}
                            </Box>
                          ) : null}
                        </>
                      }
                      sx={{ opacity: persisting ? 1 : 0.6 }}
                    />
                  )
                })}
              </Stack>
            </Box>
          ))}
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>
            Los síntomas que persisten de una o más consultas se marcan para seguimiento. Cada
            síntoma conserva el aparato/sistema con el que fue guardado.
          </Typography>
        </Stack>
      )}
    </Box>
  )
}

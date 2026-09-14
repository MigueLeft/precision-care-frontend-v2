import { Drawer, Box, Stack, Typography, IconButton, Chip, Divider, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber } from '@/utils/parse-numeric'
import { useIntakeResponseDetail } from '../hooks/useIntakeResponseDetail'
import { IntakeResponseDetailGroupSection } from './IntakeResponseDetailGroupSection'
import type { IntakeResponseDetailResult } from '../types'

interface IntakeResponseDetailDrawerProps {
  responseId: number | null
  open: boolean
  onClose: () => void
}

// Un resultado se omite del resumen cuando no tiene interpretación y su
// score es 0 o no numérico (poco informativo para el especialista).
function isInformativeResult(result: IntakeResponseDetailResult): boolean {
  if (result.interpretation) return true
  const score = Number(result.score)
  return !Number.isNaN(score) && score !== 0
}

export function IntakeResponseDetailDrawer({
  responseId,
  open,
  onClose,
}: IntakeResponseDetailDrawerProps) {
  const { data: detail, isLoading } = useIntakeResponseDetail(responseId, { enabled: open })
  const informativeResults = detail?.results.filter(isInformativeResult) ?? []

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 440 } } }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>
              DETALLE DE INGRESABLE
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
              {detail?.intakeName ?? '—'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>

        {isLoading && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={22} />
          </Box>
        )}

        {detail && (
          <>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              {detail.versionNumber !== null && (
                <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                  v{detail.versionNumber}
                </Typography>
              )}
              <Chip
                label={detail.completed ? 'Completado' : 'Pendiente'}
                size="small"
                color={detail.completed ? 'success' : 'warning'}
              />
            </Stack>

            <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 1 }}>
              Asignado: {formatShortDate(detail.startAt)}
              {detail.completedAt ? ` · Completado: ${formatShortDate(detail.completedAt)}` : ''}
            </Typography>

            {informativeResults.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  {informativeResults.map((result) => (
                    <Typography key={result.mappingId} sx={{ fontSize: '13px' }}>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        Score: {formatNumber(result.score, 0)}
                      </Box>
                      {result.interpretation ? (
                        <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          {' '}
                          · {result.interpretation}
                        </Box>
                      ) : null}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5}>
              {detail.groups.map((group, index) => (
                <IntakeResponseDetailGroupSection
                  key={group.id}
                  group={group}
                  defaultExpanded={index === 0}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  )
}

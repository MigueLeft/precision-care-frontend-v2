import type { ReactNode } from 'react'
import { Box, Stack, Typography, Chip, Divider, CircularProgress } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { useIntakeResponseDetail } from '../hooks/useIntakeResponseDetail'
import { isInformativeResult } from '../utils/format-result'
import { IntakeResponseDetailGroupSection } from './IntakeResponseDetailGroupSection'
import { IntakeResultLine } from './IntakeResultLine'

interface IntakeResponseDetailContentProps {
  responseId: number
  /** Botón de acción a la derecha del título (cerrar drawer, volver, etc.). */
  headerAction: ReactNode
}

// Cuerpo del detalle de un ingresable (título, score/interpretación por
// sección, y cada pregunta con su respuesta). Sin envoltorio de layout propio
// para poder mostrarse tanto en un Drawer como reemplazando el contenido de
// un panel (ver IntakeResponseDetailDrawer y EncounterSidebar).
export function IntakeResponseDetailContent({
  responseId,
  headerAction,
}: IntakeResponseDetailContentProps) {
  const { data: detail, isLoading } = useIntakeResponseDetail(responseId, { enabled: true })
  const informativeResults = detail?.results.filter(isInformativeResult) ?? []

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em' }}>
            DETALLE DE INGRESABLE
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {detail?.intakeName ?? '—'}
          </Typography>
        </Box>
        {headerAction}
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
                  <IntakeResultLine key={result.mappingId} {...result} />
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
    </>
  )
}

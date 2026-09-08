import { Grid, Paper, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { ScoreMeter } from '@/components/ui/ScoreMeter'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { EmptyState } from '@/components/EmptyState'
import { AppButton } from '@/components/AppButton'
import { toNumber } from '@/utils/parse-numeric'
import { formatShortDate } from '@/utils/format-date'
import { useLifestyleByPatient } from '../hooks/useLifestyleByPatient'
import {
  LIFESTYLE_COMPONENT_LABELS,
  LIFESTYLE_COMPONENT_ORDER,
  formatComponentDetail,
} from '../utils/lifestyle-format'

interface LifestylePanelProps {
  patientId: number
}

export function LifestylePanel({ patientId }: LifestylePanelProps) {
  const { data: evaluations = [], isLoading, isError, error } =
    useLifestyleByPatient(patientId)
  const latest = evaluations[0]

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  if (!latest) {
    return <EmptyState message="Sin evaluaciones de estilo de vida." />
  }

  const componentByType = new Map(
    latest.components.map((component) => [component.component, component]),
  )

  return (
    <Stack spacing={3}>
      <SectionCard
        title="Score global de estilo de vida"
        action={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Última evaluación {formatShortDate(latest.assessmentDate)}
            </Typography>
            <AppButton size="small" variant="outlined" disabled>
              Ver historial
            </AppButton>
          </Stack>
        }
      >
        <ScoreMeter value={toNumber(latest.globalScore)} size="lg" />
      </SectionCard>

      <Grid container spacing={2}>
        {LIFESTYLE_COMPONENT_ORDER.map((type) => {
          const component = componentByType.get(type)
          const detail = component
            ? formatComponentDetail(component.rawValue)
            : undefined
          return (
            <Grid key={type} size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
                <ScoreMeter
                  label={LIFESTYLE_COMPONENT_LABELS[type]}
                  value={component ? toNumber(component.score) : null}
                  caption={detail}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}

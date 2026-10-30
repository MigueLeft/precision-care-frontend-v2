import { Grid, Stack, useTheme } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import { anthropometryValues } from '../utils/anthropometry-calculations'
import type { AnthropometryValueKey, Anthropometry } from '../types'
import { AnthropometryHistoryTable } from './AnthropometryHistoryTable'
import { Trend } from './Trend'

type AnthropometryHistoryViewProps = {
  // De la más reciente a la más antigua.
  rows: Anthropometry[]
  // Medición seleccionada por el usuario al hacer click en la fecha.
  selectedId?: number | null
  onSelectRow?: (id: number) => void
}

export function AnthropometryHistoryView({ rows, selectedId, onSelectRow }: AnthropometryHistoryViewProps) {
  const theme = useTheme()
  if (rows.length === 0) return <EmptyState message="Sin mediciones históricas." />

  // Para la tendencia, en orden cronológico.
  const chronological = [...rows].reverse().map(anthropometryValues)
  const series = (key: AnthropometryValueKey) =>
    chronological.map((values) => values[key]).filter((v): v is number => v !== undefined)

  const trends = [
    { label: 'Peso (kg)', key: 'weightKg', color: theme.palette.primary.main },
    { label: 'Masa grasa (%)', key: 'fatMassPct', color: theme.palette.error.main },
    { label: 'Masa músculo esq. (kg)', key: 'skeletalMuscleMassKg', color: theme.palette.secondary.main },
  ] as const

  return (
    <Stack spacing={3}>
      <SectionCard title="Evolución">
        <Grid container spacing={3}>
          {trends.map((trend) => (
            <Grid key={trend.key} size={{ xs: 12, sm: 4 }}>
              <Trend label={trend.label} values={series(trend.key)} color={trend.color} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>
      <SectionCard title="Histórico de mediciones" disableBodyPadding>
        <AnthropometryHistoryTable
          rows={rows}
          highlightId={rows[0].id}
          selectedId={selectedId}
          onSelectRow={onSelectRow}
        />
      </SectionCard>
    </Stack>
  )
}

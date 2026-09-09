import { useState } from 'react'
import {
  Box,
  Grid,
  Stack,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { SectionCard } from '@/components/ui/SectionCard'
import { Sparkline } from '@/components/ui/Sparkline'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { toNumber, formatNumber } from '@/utils/parse-numeric'
import { formatMonthYear, formatShortDate } from '@/utils/format-date'
import type { BodyComposition } from '../types'
import { getSegment } from '../utils/body-composition-helpers'
import { CurrentMeasurement } from './CurrentMeasurement'

interface HistoryViewProps {
  compositions: BodyComposition[]
}

interface TrendProps {
  label: string
  values: number[]
  color: string
}

function Trend({ label, values, color }: TrendProps) {
  const last = values[values.length - 1]
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{label}</Typography>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color }}>
          {last !== undefined ? formatNumber(last) : '—'}
        </Typography>
      </Stack>
      <Sparkline values={values} color={color} width={200} />
    </Box>
  )
}

export function HistoryView({ compositions }: HistoryViewProps) {
  const theme = useTheme()
  const [detailId, setDetailId] = useState<number | null>(null)
  const detail = compositions.find((c) => c.id === detailId) ?? null

  if (compositions.length === 0) {
    return <EmptyState message="Sin mediciones históricas." />
  }

  // El backend ordena desc; para la tendencia necesitamos ascendente.
  const chronological = [...compositions].reverse()
  const totals = chronological.map((c) => getSegment(c, 'total'))

  const fatPctSeries = totals
    .map((s) => toNumber(s?.fatMassPct ?? null))
    .filter((v): v is number => v !== null)
  const leanKgSeries = totals
    .map((s) => toNumber(s?.leanMassKg ?? null))
    .filter((v): v is number => v !== null)
  const musclesSeries = totals
    .map((s) => toNumber(s?.skeletalMuscleMassKg ?? null))
    .filter((v): v is number => v !== null)

  return (
    <Stack spacing={3}>
      <SectionCard title="Evolución — mediciones totales">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Trend
              label="Masa grasa (%)"
              values={fatPctSeries}
              color={theme.palette.error.main}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Trend
              label="Masa magra (kg)"
              values={leanKgSeries}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Trend
              label="Masa muscular esq. (kg)"
              values={musclesSeries}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Histórico de mediciones totales" disableBodyPadding>
        <DataTable minWidth={560}>
          <TableHead>
            <TableRow>
              {['Fecha', 'Peso', 'Grasa %', 'Grasa kg', 'Magra kg', 'Musc. esq.', ''].map(
                (h, index) => (
                  <HeadCell key={`${h}-${index}`}>{h}</HeadCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {compositions.map((composition) => {
              const total = getSegment(composition, 'total')
              return (
                <TableRow key={composition.id}>
                  <DataCell sx={{ fontWeight: 600 }}>
                    {formatMonthYear(composition.assessmentDate)}
                  </DataCell>
                  <DataCell>{formatNumber(composition.weightKg)} kg</DataCell>
                  <DataCell>{formatNumber(total?.fatMassPct)}%</DataCell>
                  <DataCell>{formatNumber(total?.fatMassKg)}</DataCell>
                  <DataCell>{formatNumber(total?.leanMassKg)}</DataCell>
                  <DataCell calc>{formatNumber(total?.skeletalMuscleMassKg)}</DataCell>
                  <DataCell align="right">
                    <AppButton
                      size="small"
                      variant="text"
                      onClick={() =>
                        setDetailId((prev) => (prev === composition.id ? null : composition.id))
                      }
                    >
                      {detailId === composition.id ? 'Ocultar' : 'Ver detalle'}
                    </AppButton>
                  </DataCell>
                </TableRow>
              )
            })}
          </TableBody>
        </DataTable>
      </SectionCard>

      {detail && (
        <SectionCard title={`Detalle — ${formatShortDate(detail.assessmentDate)}`}>
          <CurrentMeasurement composition={detail} />
        </SectionCard>
      )}
    </Stack>
  )
}

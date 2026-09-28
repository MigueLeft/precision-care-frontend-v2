import { useState } from 'react'
import {
  Grid,
  Stack,
  TableBody,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { SectionCard } from '@/components/ui/SectionCard'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { toNumber, formatNumber } from '@/utils/parse-numeric'
import { formatShortDate } from '@/utils/format-date'
import type { BodyComposition } from '../types'
import { getSegment, skeletalMuscleKg } from '../utils/body-composition-helpers'
import { CurrentMeasurement } from './CurrentMeasurement'
import { Trend } from './Trend'

interface HistoryViewProps {
  compositions: BodyComposition[]
}

export function HistoryView({ compositions }: HistoryViewProps) {
  const theme = useTheme()
  const [detailId, setDetailId] = useState<number | null>(null)
  const detail = compositions.find((c) => c.id === detailId) ?? null

  if (compositions.length === 0) {
    return <EmptyState message="Sin mediciones históricas." />
  }

  // Llegan de la más reciente a la más antigua; para la tendencia, ascendente.
  const chronological = [...compositions].reverse()
  const totals = chronological.map((c) => getSegment(c, 'total'))

  const fatPctSeries = totals
    .map((s) => toNumber(s?.fatMassPct ?? null))
    .filter((v): v is number => v !== null)
  const leanKgSeries = totals
    .map((s) => toNumber(s?.leanMassKg ?? null))
    .filter((v): v is number => v !== null)
  const musclesSeries = totals
    .map((s) => skeletalMuscleKg(s))
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
        <DataTable minWidth={880}>
          <TableHead>
            <TableRow>
              {[
                'Fecha',
                'Peso',
                'Talla',
                'IMC',
                'MB kcal',
                'Agua kg',
                'Grasa %',
                'Grasa kg',
                'Magra kg',
                'Musc. esq.',
                '',
              ].map(
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
                    {formatShortDate(composition.assessmentDate)}
                  </DataCell>
                  <DataCell>{formatNumber(composition.weightKg)} kg</DataCell>
                  <DataCell>{formatNumber(composition.heightCm)} cm</DataCell>
                  <DataCell>{formatNumber(composition.bmi)}</DataCell>
                  <DataCell>{formatNumber(composition.basalMetabolismKcal)}</DataCell>
                  <DataCell>{formatNumber(composition.totalWaterKg)}</DataCell>
                  <DataCell>{formatNumber(total?.fatMassPct)}%</DataCell>
                  <DataCell>{formatNumber(total?.fatMassKg)}</DataCell>
                  <DataCell>{formatNumber(total?.leanMassKg)}</DataCell>
                  <DataCell calc>{formatNumber(skeletalMuscleKg(total))}</DataCell>
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

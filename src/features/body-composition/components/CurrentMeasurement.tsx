import { useState } from 'react'
import { Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatTile } from '@/components/ui/StatTile'
import { toNumber, formatNumber } from '@/utils/parse-numeric'
import type { BodyComposition, BodySegment } from '../types'
import { BODY_SEGMENT_LABELS, getSegment } from '../utils/body-composition-helpers'
import { SegmentSummaryTable } from './SegmentSummaryTable'
import { BodyFigure } from './BodyFigure'

interface CurrentMeasurementProps {
  composition: BodyComposition
}

const SEGMENT_OPTIONS: BodySegment[] = [
  'total',
  'torso',
  'left_arm',
  'right_arm',
  'left_leg',
  'right_leg',
]

export function CurrentMeasurement({ composition }: CurrentMeasurementProps) {
  const [segment, setSegment] = useState<BodySegment>('total')
  const current = getSegment(composition, segment)

  const skeletal = toNumber(current?.skeletalMuscleMassKg ?? null)
  const predicted = toNumber(current?.predictedMuscleMassKg ?? null)
  const deficit =
    skeletal !== null && predicted !== null ? skeletal - predicted : null

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
        <SectionCard title="Selecciona un segmento" sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
            <BodyFigure selected={segment} onSelect={setSegment} />
            <ToggleButtonGroup
              size="small"
              exclusive
              value={segment}
              onChange={(_event, next) => next && setSegment(next as BodySegment)}
              sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              {SEGMENT_OPTIONS.map((option) => (
                <ToggleButton key={option} value={option}>
                  {BODY_SEGMENT_LABELS[option]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </SectionCard>

        <SectionCard title={`${BODY_SEGMENT_LABELS[segment]} — datos de composición`} sx={{ flex: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatTile
                label="Masa grasa"
                value={formatNumber(current?.fatMassPct)}
                unit="%"
                tone="warning"
                caption={`${formatNumber(current?.fatMassKg)} kg`}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatTile
                label="Masa magra"
                value={formatNumber(current?.leanMassPct)}
                unit="%"
                tone="normal"
                caption={`${formatNumber(current?.leanMassKg)} kg`}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatTile
                label="Masa muscular esq."
                value={formatNumber(skeletal)}
                unit="kg"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatTile
                label="Déficit muscular"
                value={deficit !== null ? formatNumber(deficit) : '—'}
                unit="kg"
                tone={deficit !== null && deficit < 0 ? 'danger' : 'neutral'}
              />
            </Grid>
          </Grid>
        </SectionCard>
      </Stack>

      <SectionCard title="Resumen por segmento" disableBodyPadding>
        {composition.segments.length === 0 ? (
          <Typography sx={{ p: 3, fontSize: '13px', color: 'text.secondary' }}>
            Sin desglose por segmento.
          </Typography>
        ) : (
          <SegmentSummaryTable segments={composition.segments} />
        )}
      </SectionCard>
    </Stack>
  )
}

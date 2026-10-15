import { useState } from 'react'
import { Grid, Stack, TableBody, TableHead, TableRow, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatTile } from '@/components/ui/StatTile'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatNumber } from '@/utils/parse-numeric'
import { SEGMENTS, SEGMENT_LABELS, SEGMENT_PARAMS } from '../segment-config'
import { getSegment } from '../utils/anthropometry-calculations'
import type { Anthropometry, AnthropometrySegmentType } from '../types'
import { BodyFigure } from './BodyFigure'
import { ParamLabel } from './ParamLabel'

// Composición por segmento: figura seleccionable con el detalle del segmento y
// la tabla resumen de los cinco segmentos.
export function SegmentsCard({ row }: { row: Anthropometry }) {
  const [segment, setSegment] = useState<AnthropometrySegmentType>('torso')
  const selected = getSegment(row, segment)

  return (
    <SectionCard title="Composición por segmento">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center', width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
            <BodyFigure selected={segment} onSelect={setSegment} />
            <ToggleButtonGroup
              size="small"
              exclusive
              value={segment}
              onChange={(_event, next) => next && setSegment(next as AnthropometrySegmentType)}
              sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              {SEGMENTS.map((option) => (
                <ToggleButton key={option} value={option}>
                  {SEGMENT_LABELS[option]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
          <Grid container spacing={2} sx={{ flex: 1 }}>
            {SEGMENT_PARAMS.map((param) => (
              <Grid key={param.key} size={{ xs: 6, sm: 4 }}>
                <StatTile
                  label={param.label}
                  value={formatNumber(selected?.[param.key] ?? null)}
                  unit={param.unit}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>

        <DataTable minWidth={180 + SEGMENTS.length * 100}>
          <TableHead>
            <TableRow>
              <HeadCell>Parámetro</HeadCell>
              <HeadCell>Unidad</HeadCell>
              {SEGMENTS.map((s) => (
                <HeadCell key={s} align="right">
                  {SEGMENT_LABELS[s]}
                </HeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {SEGMENT_PARAMS.map((param) => (
              <TableRow key={param.key}>
                <DataCell>
                  <ParamLabel param={param} />
                </DataCell>
                <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
                {SEGMENTS.map((s) => (
                  <DataCell key={s} align="right" calc={param.calc}>
                    {formatNumber(getSegment(row, s)?.[param.key] ?? null)}
                  </DataCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Stack>
    </SectionCard>
  )
}

import { Box, Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { ANTHROPOMETRY_GROUPS } from '../config'
import { anthropometryValues } from '../utils/anthropometry-calculations'
import type { Anthropometry } from '../types'
import { AnthropometryValuesTable } from './AnthropometryValuesTable'
import { SegmentsCard } from './SegmentsCard'

type AnthropometryCurrentViewProps = {
  row: Anthropometry
  previous: Anthropometry | undefined
}

// Una medición completa: apartados con su cambio vs. la anterior y segmentos.
export function AnthropometryCurrentView({ row, previous }: AnthropometryCurrentViewProps) {
  const current = anthropometryValues(row)
  const prev = previous ? anthropometryValues(previous) : undefined

  return (
    <Stack spacing={3}>
      <SectionCard title={`Medición — ${formatShortDate(row.assessmentDate)}`}>
        <Stack spacing={2}>
          {ANTHROPOMETRY_GROUPS.map((group) => (
            <Box key={group.id}>
              <AnthropometryValuesTable group={group} current={current} previous={prev} />
            </Box>
          ))}
        </Stack>
        {row.notes && (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 2 }}>
            {row.notes}
          </Typography>
        )}
      </SectionCard>
      {row.segments.length > 0 && <SegmentsCard row={row} />}
    </Stack>
  )
}

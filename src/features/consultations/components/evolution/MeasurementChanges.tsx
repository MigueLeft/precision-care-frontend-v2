import { Box, Stack, Typography } from '@mui/material'
import { formatNumber, truncateTo } from '@/utils/parse-numeric'
import { NoteBlock } from '../note/NoteBlock'
import type { MeasurementChange } from '../../utils/measurement-snapshots'

type MeasurementChangesProps = {
  title: string
  items: MeasurementChange[]
}

// Parámetros numéricos que cambiaron: valor anterior → actual y la diferencia.
export function MeasurementChanges({ title, items }: MeasurementChangesProps) {
  if (items.length === 0) return null
  return (
    <NoteBlock title={title}>
      <Stack spacing={0.5}>
        {items.map((item) => {
          const delta = item.before != null ? truncateTo(item.after - item.before) : null
          return (
            <Stack key={item.key} direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
              <Typography sx={{ fontSize: '13px', flex: 1, minWidth: 0 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                {item.before != null ? `${formatNumber(item.before)} → ` : 'Nuevo: '}
                <strong>{formatNumber(item.after)}</strong> {item.unit}
              </Typography>
              {delta != null && (
                <Box
                  component="span"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    minWidth: 52,
                    textAlign: 'right',
                    color: delta > 0 ? 'info.main' : 'warning.main',
                  }}
                >
                  {delta > 0 ? '+' : ''}
                  {formatNumber(delta)}
                </Box>
              )}
            </Stack>
          )
        })}
      </Stack>
    </NoteBlock>
  )
}

import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

export type StatTileTone = 'neutral' | 'normal' | 'warning' | 'danger'

interface StatTileProps {
  label: string
  value: string
  unit?: string
  tone?: StatTileTone
  /** Texto pequeño bajo el valor (rango de referencia o estado). */
  caption?: string
}

const TONE_TO_PALETTE = {
  normal: 'success',
  warning: 'warning',
  danger: 'error',
} as const

export function StatTile({ label, value, unit, tone = 'neutral', caption }: StatTileProps) {
  return (
    <Box
      sx={(theme) => {
        const color =
          tone === 'neutral'
            ? theme.palette.grey[500]
            : theme.palette[TONE_TO_PALETTE[tone]].main
        return {
          p: 2,
          height: '100%',
          borderRadius: '8px',
          bgcolor: alpha(color, 0.08),
          border: '1px solid',
          borderColor: alpha(color, 0.2),
        }
      }}
    >
      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{label}</Typography>
      <Typography
        sx={(theme) => ({
          fontSize: '20px',
          fontWeight: 700,
          mt: 0.5,
          color:
            tone === 'neutral'
              ? theme.palette.text.primary
              : theme.palette[TONE_TO_PALETTE[tone]].main,
        })}
      >
        {value}
        {unit && (
          <Typography component="span" sx={{ fontSize: '13px', fontWeight: 600, ml: 0.5 }}>
            {unit}
          </Typography>
        )}
      </Typography>
      {caption && (
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.25 }}>
          {caption}
        </Typography>
      )}
    </Box>
  )
}

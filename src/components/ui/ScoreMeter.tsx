import { Box, LinearProgress, Stack, Typography } from '@mui/material'

interface ScoreMeterProps {
  /** Valor 0–100. */
  value: number | null
  label?: string
  caption?: string
  size?: 'sm' | 'lg'
}

// Verde ≥70, ámbar 40–69, rojo <40.
function toneColor(value: number): 'success.main' | 'warning.main' | 'error.main' {
  if (value >= 70) return 'success.main'
  if (value >= 40) return 'warning.main'
  return 'error.main'
}

export function ScoreMeter({ value, label, caption, size = 'sm' }: ScoreMeterProps) {
  const safe = value === null ? 0 : Math.max(0, Math.min(100, value))
  const color = value === null ? 'grey.400' : toneColor(safe)

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        {label && (
          <Typography sx={{ fontSize: size === 'lg' ? '14px' : '13px', fontWeight: 600 }}>
            {label}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: size === 'lg' ? '28px' : '15px',
            fontWeight: 700,
            color: value === null ? 'text.secondary' : color,
          }}
        >
          {value === null ? '—' : Math.round(safe)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={safe}
        sx={{
          mt: 0.5,
          height: 6,
          borderRadius: 3,
          bgcolor: 'grey.100',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
        }}
      />
      {caption && (
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.5 }}>
          {caption}
        </Typography>
      )}
    </Box>
  )
}

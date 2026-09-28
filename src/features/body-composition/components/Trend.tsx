import { Box, Stack, Typography } from '@mui/material'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatNumber } from '@/utils/parse-numeric'

interface TrendProps {
  label: string
  values: number[]
  color: string
}

// Tendencia de un valor total: último valor y sparkline.
export function Trend({ label, values, color }: TrendProps) {
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

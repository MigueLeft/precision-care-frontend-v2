import { Box } from '@mui/material'

interface SparklineProps {
  values: number[]
  width?: number
  height?: number
  color?: string
}

// Mini gráfico de tendencia en SVG puro (sin librería).
export function Sparkline({
  values,
  width = 160,
  height = 40,
  color = 'currentColor',
}: SparklineProps) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = width / (values.length - 1)

  const points = values
    .map((value, index) => {
      const x = index * stepX
      const y = height - ((value - min) / range) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width, height, color }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  )
}

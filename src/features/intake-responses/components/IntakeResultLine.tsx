import { Box, Typography } from '@mui/material'
import { getResultName, getResultScoreText } from '../utils/format-result'

interface IntakeResultLineProps {
  name: string | null
  destinationField: string | null
  score: string
  interpretation: string | null
}

// "Nombre del score: puntaje · interpretación". El puntaje solo aparece si el
// resultado lo tiene (ver getResultScoreText).
export function IntakeResultLine({
  name,
  destinationField,
  score,
  interpretation,
}: IntakeResultLineProps) {
  const scoreText = getResultScoreText({ score })
  return (
    <Typography sx={{ fontSize: '13px' }}>
      <Box component="span" sx={{ fontWeight: 700 }}>
        {getResultName({ name, destinationField })}
        {scoreText ? `: ${scoreText}` : ''}
      </Box>
      {interpretation ? (
        <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {' '}
          · {interpretation}
        </Box>
      ) : null}
    </Typography>
  )
}

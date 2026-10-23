import { Stack, Typography } from '@mui/material'
import type { ChatTurn } from '../types'

const SPEAKER: Record<ChatTurn['role'], string> = { user: 'Paciente', assistant: 'NutriBot' }

type NutritionRecallTranscriptProps = {
  transcript: ChatTurn[]
}

// Entrevista completa con NutriBot, tal como la respondió el paciente.
export function NutritionRecallTranscript({ transcript }: NutritionRecallTranscriptProps) {
  if (transcript.length === 0) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
        El paciente aún no termina la entrevista.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      {transcript.map((turn, index) => (
        <Stack
          key={index}
          spacing={0.25}
          sx={{
            p: 1.5,
            borderRadius: '8px',
            bgcolor: turn.role === 'user' ? 'action.hover' : 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
            {SPEAKER[turn.role]}
          </Typography>
          <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{turn.content}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

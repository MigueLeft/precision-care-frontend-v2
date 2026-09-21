import { TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

// Texto libre. Con `displayVariant: 'short_text'` es de una sola línea.
export function TextAnswerField({ question, value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'text' ? value.value : ''
  const isShort = question.displayVariant === 'short_text'
  return (
    <TextField
      multiline={!isShort}
      minRows={isShort ? undefined : 2}
      size="small"
      value={current}
      onChange={(e) => onChange({ kind: 'text', value: e.target.value })}
      fullWidth
    />
  )
}

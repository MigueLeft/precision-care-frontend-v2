import { TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'
import { sanitizeTextInput } from '../../utils/text-input-filters'

const SINGLE_LINE_VARIANTS = ['short_text', 'letters_only', 'phone']

// Texto libre. Las variantes de una línea (`short_text`, `letters_only`,
// `phone`) usan un solo renglón; `letters_only` y `phone` además filtran lo
// que el campo no admite.
export function TextAnswerField({ question, value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'text' ? value.value : ''
  const isShort = SINGLE_LINE_VARIANTS.includes(question.displayVariant ?? '')
  return (
    <TextField
      multiline={!isShort}
      minRows={isShort ? undefined : 2}
      size="small"
      value={current}
      onChange={(e) =>
        onChange({ kind: 'text', value: sanitizeTextInput(e.target.value, question.displayVariant) })
      }
      slotProps={{ htmlInput: { inputMode: question.displayVariant === 'phone' ? 'tel' : undefined } }}
      fullWidth
    />
  )
}

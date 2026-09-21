import { TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

const BLOCKED_KEYS = ['-', '+', 'e', 'E']

// Ningún campo numérico del ingresable admite valores negativos.
export function NumericField({ value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'numeric' ? value.value : ''
  return (
    <TextField
      type="number"
      size="small"
      value={current}
      onKeyDown={(e) => {
        if (BLOCKED_KEYS.includes(e.key)) e.preventDefault()
      }}
      onChange={(e) => {
        const raw = e.target.value
        if (raw.startsWith('-') || Number(raw) < 0) return
        onChange({ kind: 'numeric', value: raw })
      }}
      slotProps={{ htmlInput: { min: 0, inputMode: 'decimal' } }}
      sx={{ maxWidth: 240 }}
    />
  )
}

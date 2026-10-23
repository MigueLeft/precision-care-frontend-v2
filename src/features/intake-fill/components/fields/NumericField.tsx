import { InputAdornment, TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'
import { heightError, normalizeHeightCm } from '../../utils/height'

const BLOCKED_KEYS = ['-', '+', 'e', 'E']

// Ningún campo numérico del ingresable admite valores negativos. La talla
// ('height_cm') va en centímetros: "1.72" se convierte a 172 al salir.
export function NumericField({ question, value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'numeric' ? value.value : ''
  const isHeight = question.displayVariant === 'height_cm'
  const error = isHeight ? heightError(current) : null

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
      onBlur={() => {
        if (!isHeight) return
        const normalized = normalizeHeightCm(current)
        if (normalized !== current) onChange({ kind: 'numeric', value: normalized })
      }}
      error={!!error}
      helperText={isHeight ? (error ?? 'En centímetros, por ejemplo 172') : undefined}
      slotProps={{
        htmlInput: { min: 0, inputMode: 'decimal' },
        input: isHeight ? { endAdornment: <InputAdornment position="end">cm</InputAdornment> } : undefined,
      }}
      sx={{ maxWidth: 240 }}
    />
  )
}

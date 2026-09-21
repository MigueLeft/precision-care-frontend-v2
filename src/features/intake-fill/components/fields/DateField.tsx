import { TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

export function DateField({ value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'date' ? value.value : ''
  return (
    <TextField
      type="date"
      size="small"
      value={current}
      onChange={(e) => onChange({ kind: 'date', value: e.target.value })}
      slotProps={{ inputLabel: { shrink: true } }}
      sx={{ maxWidth: 240 }}
    />
  )
}

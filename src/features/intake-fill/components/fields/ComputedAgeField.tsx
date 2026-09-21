import { TextField } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

// Edad de solo lectura: el flujo la calcula desde la fecha de nacimiento de
// la misma sección (ver useIntakeFillFlow).
export function ComputedAgeField({ value }: QuestionFieldProps) {
  const current = value?.kind === 'numeric' ? value.value : ''
  return (
    <TextField
      size="small"
      value={current}
      placeholder="Se calcula con la fecha de nacimiento"
      disabled
      sx={{ maxWidth: 320 }}
    />
  )
}

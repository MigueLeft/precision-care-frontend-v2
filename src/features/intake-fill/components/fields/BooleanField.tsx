import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

export function BooleanField({ value, onChange }: QuestionFieldProps) {
  const current = value?.kind === 'boolean' ? String(value.value) : ''
  return (
    <RadioGroup
      row
      value={current}
      onChange={(e) => onChange({ kind: 'boolean', value: e.target.value === 'true' })}
    >
      <FormControlLabel value="true" control={<Radio size="small" />} label="Sí" />
      <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
    </RadioGroup>
  )
}

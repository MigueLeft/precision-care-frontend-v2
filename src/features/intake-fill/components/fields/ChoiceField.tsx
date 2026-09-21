import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

// Selección única. Con `displayVariant: 'inline'` las opciones se acomodan en
// una fila que salta de línea, para ahorrar espacio vertical.
export function ChoiceField({ question, value, onChange }: QuestionFieldProps) {
  const selected = value?.kind === 'option' ? value.optionId : ''
  return (
    <RadioGroup
      row={question.displayVariant === 'inline'}
      value={selected}
      onChange={(e) => onChange({ kind: 'option', optionId: Number(e.target.value) })}
    >
      {(question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          value={option.id}
          control={<Radio size="small" />}
          label={option.text}
        />
      ))}
    </RadioGroup>
  )
}

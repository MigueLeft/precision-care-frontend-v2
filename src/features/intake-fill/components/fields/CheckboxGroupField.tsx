import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

export function CheckboxGroupField({ question, value, onChange }: QuestionFieldProps) {
  const selected = value?.kind === 'options' ? value.optionIds : []

  function toggle(optionId: number) {
    const next = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId]
    onChange({ kind: 'options', optionIds: next })
  }

  return (
    <FormGroup>
      {(question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          control={
            <Checkbox
              size="small"
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
            />
          }
          label={option.text}
        />
      ))}
    </FormGroup>
  )
}

import { Checkbox, FormControlLabel, Stack } from '@mui/material'
import type { QuestionFieldProps } from '../../types'

// Escala (ej. 1-10) en horizontal, con una casilla por valor. Es de selección
// única: marcar una casilla desmarca la anterior.
export function ScaleField({ question, value, onChange }: QuestionFieldProps) {
  const selected = value?.kind === 'option' ? value.optionId : null
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
      {(question.options ?? []).map((option) => (
        <FormControlLabel
          key={option.id}
          labelPlacement="bottom"
          sx={{ m: 0, minWidth: 44 }}
          control={
            <Checkbox
              size="small"
              checked={selected === option.id}
              onChange={() => onChange({ kind: 'option', optionId: option.id })}
            />
          }
          label={option.text}
        />
      ))}
    </Stack>
  )
}

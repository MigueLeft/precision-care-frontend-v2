import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { IntakeResponseDetailQuestion } from '@/features/intake-responses'

export type AnswerDraft =
  | { kind: 'option'; optionId: number }
  | { kind: 'options'; optionIds: number[] }
  | { kind: 'text'; value: string }
  | { kind: 'numeric'; value: string }
  | { kind: 'date'; value: string }
  | { kind: 'boolean'; value: boolean }

interface PublicQuestionFieldProps {
  question: IntakeResponseDetailQuestion
  value: AnswerDraft | undefined
  onChange: (value: AnswerDraft) => void
}

// Un campo por tipo de pregunta del ingresable. No evalúa condiciones lógicas
// entre preguntas (logic_condition) — todas las preguntas se muestran, igual
// que la vista de "ver respuestas" del staff (findDetailedById).
export function PublicQuestionField({ question, value, onChange }: PublicQuestionFieldProps) {
  const options = question.options ?? []

  return (
    <Stack spacing={0.75}>
      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{question.text}</Typography>
      {renderInput()}
    </Stack>
  )

  function renderInput() {
    if (question.type === 'boolean') {
      const boolValue = value?.kind === 'boolean' ? value.value : undefined
      return (
        <RadioGroup
          row
          value={boolValue === undefined ? '' : String(boolValue)}
          onChange={(e) => onChange({ kind: 'boolean', value: e.target.value === 'true' })}
        >
          <FormControlLabel value="true" control={<Radio size="small" />} label="Sí" />
          <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
        </RadioGroup>
      )
    }

    if (question.type === 'multiple_choice') {
      const selected = value?.kind === 'options' ? value.optionIds : []
      const toggle = (optionId: number) => {
        const next = selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId]
        onChange({ kind: 'options', optionIds: next })
      }
      return (
        <FormGroup>
          {options.map((option) => (
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

    if (options.length > 0) {
      // single_choice, y scale cuando trae opciones (ej. escalera 1-10).
      const selected = value?.kind === 'option' ? value.optionId : ''
      return (
        <RadioGroup
          value={selected}
          onChange={(e) => onChange({ kind: 'option', optionId: Number(e.target.value) })}
        >
          {options.map((option) => (
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

    if (question.type === 'numeric' || question.type === 'scale') {
      const numValue = value?.kind === 'numeric' ? value.value : ''
      return (
        <TextField
          type="number"
          size="small"
          value={numValue}
          onChange={(e) => onChange({ kind: 'numeric', value: e.target.value })}
          sx={{ maxWidth: 240 }}
        />
      )
    }

    if (question.type === 'date') {
      const dateValue = value?.kind === 'date' ? value.value : ''
      return (
        <TextField
          type="date"
          size="small"
          value={dateValue}
          onChange={(e) => onChange({ kind: 'date', value: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: 240 }}
        />
      )
    }

    // free_text (o cualquier tipo sin manejo explícito)
    const textValue = value?.kind === 'text' ? value.value : ''
    return (
      <TextField
        multiline
        minRows={2}
        size="small"
        value={textValue}
        onChange={(e) => onChange({ kind: 'text', value: e.target.value })}
        fullWidth
      />
    )
  }
}

import { Stack, Typography } from '@mui/material'
import type { QuestionFieldProps } from '../types'
import { BooleanField } from './fields/BooleanField'
import { CheckboxGroupField } from './fields/CheckboxGroupField'
import { ChoiceField } from './fields/ChoiceField'
import { ComputedAgeField } from './fields/ComputedAgeField'
import { DateField } from './fields/DateField'
import { NumericField } from './fields/NumericField'
import { ScaleField } from './fields/ScaleField'
import { SelectMultiField } from './fields/SelectMultiField'
import { TextAnswerField } from './fields/TextAnswerField'

// Elige el campo según el tipo de pregunta y su `displayVariant`. La
// visibilidad (logic_condition) la resuelve quien lo renderiza.
function QuestionInput(props: QuestionFieldProps) {
  const { question } = props
  const hasOptions = (question.options?.length ?? 0) > 0

  if (question.displayVariant === 'computed_age') return <ComputedAgeField {...props} />
  if (question.type === 'boolean') return <BooleanField {...props} />
  if (question.type === 'multiple_choice') {
    return question.displayVariant === 'select' ? (
      <SelectMultiField {...props} />
    ) : (
      <CheckboxGroupField {...props} />
    )
  }
  if (question.type === 'scale' && hasOptions) return <ScaleField {...props} />
  if (hasOptions) return <ChoiceField {...props} />
  if (question.type === 'numeric' || question.type === 'scale') return <NumericField {...props} />
  if (question.type === 'date') return <DateField {...props} />
  return <TextAnswerField {...props} />
}

export function PublicQuestionField(props: QuestionFieldProps) {
  return (
    <Stack spacing={0.75}>
      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{props.question.text}</Typography>
      <QuestionInput {...props} />
    </Stack>
  )
}

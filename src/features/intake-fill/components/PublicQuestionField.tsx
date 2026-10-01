import { Stack, Typography } from '@mui/material'
import type { QuestionFieldProps } from '../types'
import { isEventListVariant } from '../utils/event-list'
import { BooleanField } from './fields/BooleanField'
import { CheckboxGroupField } from './fields/CheckboxGroupField'
import { ChoiceField } from './fields/ChoiceField'
import { CountryField } from './fields/CountryField'
import { DateField } from './fields/DateField'
import { EventListField } from './fields/EventListField'
import { FamilyRelationshipField } from './fields/FamilyRelationshipField'
import { NumericField } from './fields/NumericField'
import { ScaleField } from './fields/ScaleField'
import { SelectMultiField } from './fields/SelectMultiField'
import { TextAnswerField } from './fields/TextAnswerField'

// Elige el campo según el tipo de pregunta y su `displayVariant`. La
// visibilidad (logic_condition) la resuelve quien lo renderiza.
function QuestionInput(props: QuestionFieldProps) {
  const { question } = props
  const hasOptions = (question.options?.length ?? 0) > 0

  if (question.type === 'boolean') return <BooleanField {...props} />
  if (question.type === 'multiple_choice') {
    if (question.displayVariant === 'family_relationship') {
      return <FamilyRelationshipField {...props} />
    }
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
  if (isEventListVariant(question.displayVariant)) return <EventListField {...props} />
  if (question.displayVariant === 'country' || question.displayVariant === 'nationality') {
    return <CountryField {...props} />
  }
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

import { Stack } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import type { AnswerDraft, AnswerMap } from '../types'
import type { IntakeStep } from '../utils/intake-steps'
import { isQuestionVisible, type QuestionIndex } from '../utils/question-visibility'
import { PublicQuestionField } from './PublicQuestionField'

interface IntakeStepContentProps {
  step: IntakeStep
  answers: AnswerMap
  questionIndex: QuestionIndex
  onAnswer: (questionId: number, draft: AnswerDraft) => void
}

// Secciones del paso actual. Las preguntas dependientes de otra respuesta
// simplemente no se renderizan mientras su condición no se cumpla.
export function IntakeStepContent({
  step,
  answers,
  questionIndex,
  onAnswer,
}: IntakeStepContentProps) {
  return (
    <Stack spacing={2.5}>
      {step.groups.map((group) => (
        <CollapsibleSection key={group.id} title={group.title} defaultExpanded>
          <Stack spacing={2.5}>
            {group.questions
              .filter((question) => isQuestionVisible(question, questionIndex, answers))
              .map((question) => (
                <PublicQuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(draft) => onAnswer(question.id, draft)}
                />
              ))}
          </Stack>
        </CollapsibleSection>
      ))}
    </Stack>
  )
}

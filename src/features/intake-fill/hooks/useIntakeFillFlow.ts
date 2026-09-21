import { useState } from 'react'
import { toast } from 'sonner'
import type { IntakeResponseDetail } from '@/features/intake-responses'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { completePublicIntakeResponse, submitPublicAnswer } from '../services/intake-fill.service'
import type { AnswerDraft, AnswerMap } from '../types'
import { collectPayloads } from '../utils/answer-payloads'
import { calculateAge } from '../utils/calculate-age'
import { buildIntakeSteps } from '../utils/intake-steps'
import { buildQuestionIndex } from '../utils/question-visibility'

// Estado del formulario público por pasos: respuestas, paso actual y envío.
export function useIntakeFillFlow(token: string, response: IntakeResponseDetail | undefined) {
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const steps = response ? buildIntakeSteps(response.groups, response.patient?.sex ?? null) : []
  const questionIndex = buildQuestionIndex(steps.flatMap((step) => step.groups))
  const isLastStep = stepIndex >= steps.length - 1

  // Al cambiar una fecha, recalcula la edad (`computed_age`) de su sección.
  function setAnswer(questionId: number, draft: AnswerDraft) {
    const ageQuestion =
      draft.kind === 'date'
        ? steps
            .flatMap((step) => step.groups)
            .find((group) => group.questions.some((q) => q.id === questionId))
            ?.questions.find((q) => q.displayVariant === 'computed_age')
        : undefined

    setAnswers((prev) => {
      const next = { ...prev, [questionId]: draft }
      if (ageQuestion && draft.kind === 'date') {
        const age = calculateAge(draft.value)
        if (age === null) delete next[ageQuestion.id]
        else next[ageQuestion.id] = { kind: 'numeric', value: String(age) }
      }
      return next
    })
  }

  function goToStep(next: number) {
    setStepIndex(Math.max(0, Math.min(next, steps.length - 1)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit() {
    setSubmitting(true)
    try {
      for (const payload of collectPayloads(steps, questionIndex, answers)) {
        await submitPublicAnswer(token, payload)
      }
      await completePublicIntakeResponse(token)
      setJustCompleted(true)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo enviar el formulario.'))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    steps,
    step: steps[stepIndex],
    stepIndex,
    isLastStep,
    answers,
    questionIndex,
    submitting,
    justCompleted,
    setAnswer,
    next: () => goToStep(stepIndex + 1),
    back: () => goToStep(stepIndex - 1),
    submit,
  }
}

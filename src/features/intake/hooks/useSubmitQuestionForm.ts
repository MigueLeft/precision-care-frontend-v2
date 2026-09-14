import { useCreateQuestion } from './useCreateQuestion'
import { useUpdateQuestion } from './useUpdateQuestion'
import { useCreateOption } from './useCreateOption'
import { useUpdateOption } from './useUpdateOption'
import { useDeleteOption } from './useDeleteOption'
import type { Question, CreateQuestionPayload } from '../types'
import type { QuestionFormValues } from '../schemas/question-form.schema'

interface UseSubmitQuestionFormArgs {
  intakeId: number
  versionId: number
  groupId: number | null
  questionsCount: number
  editingQuestion: Question | null
  onSuccess: () => void
}

/** Crea/edita una pregunta y sincroniza sus opciones (crear/actualizar/eliminar por posición). */
export function useSubmitQuestionForm({
  intakeId,
  versionId,
  groupId,
  questionsCount,
  editingQuestion,
  onSuccess,
}: UseSubmitQuestionFormArgs) {
  const createMutation = useCreateQuestion(intakeId, { onSuccess })
  const updateMutation = useUpdateQuestion(intakeId, { onSuccess })
  const createOptionMutation = useCreateOption(intakeId)
  const updateOptionMutation = useUpdateOption(intakeId)
  const deleteOptionMutation = useDeleteOption(intakeId)

  async function submit(values: QuestionFormValues) {
    const basePayload: CreateQuestionPayload = {
      groupId: groupId ?? undefined,
      text: values.text,
      type: values.type,
      required: values.required,
      sortOrder: editingQuestion?.sortOrder ?? questionsCount,
    }

    if (!editingQuestion) {
      const question = await createMutation.mutateAsync({ versionId, payload: basePayload })
      for (const [index, option] of values.options.entries()) {
        await createOptionMutation.mutateAsync({
          questionId: question.id,
          payload: { ...option, sortOrder: index },
        })
      }
      return
    }

    await updateMutation.mutateAsync({ questionId: editingQuestion.id, payload: basePayload })

    const existingIds = new Set(editingQuestion.options.map((o) => o.id))
    const keptIds = new Set<number>()

    for (const [index, option] of values.options.entries()) {
      const existing = editingQuestion.options[index]
      if (existing) {
        keptIds.add(existing.id)
        await updateOptionMutation.mutateAsync({
          optionId: existing.id,
          payload: { ...option, sortOrder: index },
        })
      } else {
        await createOptionMutation.mutateAsync({
          questionId: editingQuestion.id,
          payload: { ...option, sortOrder: index },
        })
      }
    }

    for (const id of existingIds) {
      if (!keptIds.has(id)) await deleteOptionMutation.mutateAsync(id)
    }
  }

  return {
    submit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  }
}

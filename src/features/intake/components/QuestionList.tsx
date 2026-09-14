import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDeleteQuestion } from '../hooks/useDeleteQuestion'
import { useSubmitQuestionForm } from '../hooks/useSubmitQuestionForm'
import { questionFormDefaultValues } from '../schemas/question-form.schema'
import { mapQuestionToFormValues } from '../utils/map-question-to-form-values'
import { QuestionRow } from './QuestionRow'
import { QuestionFormModal } from './QuestionFormModal'
import type { Question } from '../types'
import type { QuestionFormValues } from '../schemas/question-form.schema'

interface QuestionListProps {
  intakeId: number
  versionId: number
  groupId: number | null
  questions: Question[]
  readOnly: boolean
  onConfigureMapping: (questionId: number) => void
}

export function QuestionList({
  intakeId,
  versionId,
  groupId,
  questions,
  readOnly,
  onConfigureMapping,
}: QuestionListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const editingQuestion = questions.find((q) => q.id === editingId) ?? null
  const deleteMutation = useDeleteQuestion(intakeId, { onSuccess: () => setDeletingId(null) })

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  const { submit, isSubmitting } = useSubmitQuestionForm({
    intakeId,
    versionId,
    groupId,
    questionsCount: questions.length,
    editingQuestion,
    onSuccess: closeForm,
  })

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: QuestionFormValues = editingQuestion
    ? mapQuestionToFormValues(editingQuestion)
    : questionFormDefaultValues

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Preguntas ({questions.length})
        </Typography>
        {!readOnly && (
          <AppButton size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => setIsCreateOpen(true)}>
            Agregar pregunta
          </AppButton>
        )}
      </Stack>

      <Stack spacing={1}>
        {questions.map((question) => (
          <QuestionRow
            key={question.id}
            question={question}
            readOnly={readOnly}
            onEdit={() => setEditingId(question.id)}
            onDelete={() => setDeletingId(question.id)}
            onConfigureMapping={() => onConfigureMapping(question.id)}
          />
        ))}
      </Stack>

      <QuestionFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={isSubmitting}
        onSubmit={submit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar pregunta"
        description="¿Eliminar esta pregunta? También se eliminarán sus opciones y mapeos."
        isConfirming={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}

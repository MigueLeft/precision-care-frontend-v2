import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useQuestionnaires } from '../hooks/useQuestionnaires'
import { useCreateQuestionnaire } from '../hooks/useCreateQuestionnaire'
import { useUpdateQuestionnaire } from '../hooks/useUpdateQuestionnaire'
import { useDeleteQuestionnaire } from '../hooks/useDeleteQuestionnaire'
import { filterQuestionnaires } from '../utils/filter-questionnaires'
import { mapQuestionnaireToFormValues } from '../utils/map-questionnaire-to-form-values'
import { mapQuestionnaireFormToPayload } from '../utils/map-questionnaire-form-to-payload'
import { questionnaireFormDefaultValues } from '../schemas/questionnaire-form.schema'
import { QuestionnairesToolbar } from './QuestionnairesToolbar'
import { QuestionnairesTable } from './QuestionnairesTable'
import { QuestionnaireFormModal } from './QuestionnaireFormModal'
import { DeleteQuestionnaireDialog } from './DeleteQuestionnaireDialog'
import type { QuestionnaireFormValues } from '../schemas/questionnaire-form.schema'

export function QuestionnairesPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: questionnaires = [] } = useQuestionnaires()

  const filtered = filterQuestionnaires(questionnaires, { q, type })
  const editingQuestionnaire = questionnaires.find((item) => item.id === editingId) ?? null
  const deletingQuestionnaire = questionnaires.find((item) => item.id === deletingId) ?? null

  const createMutation = useCreateQuestionnaire({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateQuestionnaire(editingId ?? undefined, {
    onSuccess: () => setEditingId(null),
  })
  const deleteMutation = useDeleteQuestionnaire({ onSuccess: () => setDeletingId(null) })

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: QuestionnaireFormValues = isCreateOpen
    ? questionnaireFormDefaultValues
    : editingQuestionnaire
      ? mapQuestionnaireToFormValues(editingQuestionnaire)
      : questionnaireFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: QuestionnaireFormValues) {
    const payload = mapQuestionnaireFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Ingresables
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Cuestionarios estructurados en secciones y preguntas, con puntuación y mapeo a la historia clínica.
      </Typography>

      <QuestionnairesToolbar
        q={q}
        type={type}
        onQChange={setQ}
        onTypeChange={setType}
        onAdd={() => setIsCreateOpen(true)}
      />

      <QuestionnairesTable
        questionnaires={filtered}
        onEdit={(id) => setEditingId(id)}
        onDelete={(id) => setDeletingId(id)}
      />

      <QuestionnaireFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteQuestionnaireDialog
        open={deletingId !== null}
        questionnaireName={deletingQuestionnaire?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </Box>
  )
}

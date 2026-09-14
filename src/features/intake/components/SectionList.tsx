import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useCreateSection } from '../hooks/useCreateSection'
import { useUpdateSection } from '../hooks/useUpdateSection'
import { useDeleteSection } from '../hooks/useDeleteSection'
import { sectionFormDefaultValues } from '../schemas/section-form.schema'
import { SectionCard } from './SectionCard'
import { SectionFormModal } from './SectionFormModal'
import type { QuestionGroup } from '../types'
import type { SectionFormValues } from '../schemas/section-form.schema'

interface SectionListProps {
  intakeId: number
  versionId: number
  sections: QuestionGroup[]
  readOnly: boolean
  onConfigureSectionMapping: (groupId: number) => void
  onConfigureQuestionMapping: (questionId: number) => void
}

export function SectionList({
  intakeId,
  versionId,
  sections,
  readOnly,
  onConfigureSectionMapping,
  onConfigureQuestionMapping,
}: SectionListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const editingSection = sections.find((s) => s.id === editingId) ?? null

  const createMutation = useCreateSection(intakeId, { onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateSection(intakeId, { onSuccess: () => setEditingId(null) })
  const deleteMutation = useDeleteSection(intakeId, { onSuccess: () => setDeletingId(null) })

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: SectionFormValues = editingSection
    ? {
        title: editingSection.title,
        description: editingSection.description ?? '',
        lifestyleComponent: editingSection.lifestyleComponent ?? '',
      }
    : sectionFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: SectionFormValues) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      lifestyleComponent: values.lifestyleComponent || undefined,
    }
    if (isCreateOpen) {
      createMutation.mutate({ versionId, payload: { ...payload, sortOrder: sections.length } })
    } else if (editingId) {
      updateMutation.mutate({ groupId: editingId, payload })
    }
  }

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h6">Secciones</Typography>
        {!readOnly && (
          <AppButton
            size="small"
            variant="outlined"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={() => setIsCreateOpen(true)}
          >
            Agregar sección
          </AppButton>
        )}
      </Stack>

      <Stack spacing={2}>
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            versionId={versionId}
            intakeId={intakeId}
            readOnly={readOnly}
            onEdit={() => setEditingId(section.id)}
            onDelete={() => setDeletingId(section.id)}
            onConfigureSectionMapping={() => onConfigureSectionMapping(section.id)}
            onConfigureQuestionMapping={onConfigureQuestionMapping}
          />
        ))}
      </Stack>

      {sections.length === 0 && (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Aún no hay secciones.
        </Typography>
      )}

      <SectionFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar sección"
        description="¿Eliminar esta sección? También se eliminarán sus preguntas y mapeos."
        isConfirming={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}

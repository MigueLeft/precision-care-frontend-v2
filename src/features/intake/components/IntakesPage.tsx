import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useIntakes } from '../hooks/useIntakes'
import { useCreateIntake } from '../hooks/useCreateIntake'
import { useUpdateIntake } from '../hooks/useUpdateIntake'
import { useDeleteIntake } from '../hooks/useDeleteIntake'
import { filterIntakes } from '../utils/filter-intakes'
import { mapIntakeToFormValues } from '../utils/map-intake-to-form-values'
import { mapIntakeFormToPayload } from '../utils/map-intake-form-to-payload'
import { intakeFormDefaultValues } from '../schemas/intake-form.schema'
import { IntakesToolbar } from './IntakesToolbar'
import { IntakesTable } from './IntakesTable'
import { IntakeFormModal } from './IntakeFormModal'
import { DeleteIntakeDialog } from './DeleteIntakeDialog'
import type { IntakeFormValues } from '../schemas/intake-form.schema'

export function IntakesPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: intakes = [] } = useIntakes()

  const filtered = filterIntakes(intakes, { q, type })
  const editingIntake = intakes.find((item) => item.id === editingId) ?? null
  const deletingIntake = intakes.find((item) => item.id === deletingId) ?? null

  const createMutation = useCreateIntake({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateIntake(editingId ?? undefined, {
    onSuccess: () => setEditingId(null),
  })
  const deleteMutation = useDeleteIntake({ onSuccess: () => setDeletingId(null) })

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: IntakeFormValues = isCreateOpen
    ? intakeFormDefaultValues
    : editingIntake
      ? mapIntakeToFormValues(editingIntake)
      : intakeFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: IntakeFormValues) {
    const payload = mapIntakeFormToPayload(values)
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
        Ingresables estructurados en secciones y preguntas, con puntuación y mapeo a la historia clínica.
      </Typography>

      <IntakesToolbar
        q={q}
        type={type}
        onQChange={setQ}
        onTypeChange={setType}
        onAdd={() => setIsCreateOpen(true)}
      />

      <IntakesTable
        intakes={filtered}
        onEdit={(id) => setEditingId(id)}
        onDelete={(id) => setDeletingId(id)}
      />

      <IntakeFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <DeleteIntakeDialog
        open={deletingId !== null}
        intakeName={deletingIntake?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </Box>
  )
}

import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useBodySystems } from '../hooks/useBodySystems'
import { useCreateBodySystem } from '../hooks/useCreateBodySystem'
import { useUpdateBodySystem } from '../hooks/useUpdateBodySystem'
import { useToggleBodySystemActive } from '../hooks/useToggleBodySystemActive'
import { mapBodySystemToFormValues } from '../utils/map-body-system-to-form-values'
import { mapBodySystemFormToPayload } from '../utils/map-body-system-form-to-payload'
import { bodySystemFormDefaultValues } from '../schemas/body-system-form.schema'
import { BodySystemsTable } from './BodySystemsTable'
import { BodySystemFormModal } from './BodySystemFormModal'
import type { BodySystemFormValues } from '../schemas/body-system-form.schema'

export function BodySystemsTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: bodySystems = [] } = useBodySystems()
  const editingBodySystem = bodySystems.find((item) => item.id === editingId) ?? null
  const existingShortCodes = bodySystems.filter((item) => item.id !== editingId).map((item) => item.shortCode)

  const createMutation = useCreateBodySystem({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateBodySystem(editingId ?? undefined, { onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleBodySystemActive()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: BodySystemFormValues = isCreateOpen
    ? bodySystemFormDefaultValues
    : editingBodySystem
      ? mapBodySystemToFormValues(editingBodySystem)
      : bodySystemFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: BodySystemFormValues) {
    const payload = mapBodySystemFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {bodySystems.length} aparatos/sistemas
        </Typography>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Agregar
        </AppButton>
      </Stack>

      <BodySystemsTable
        items={bodySystems}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <BodySystemFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        existingShortCodes={existingShortCodes}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </div>
  )
}

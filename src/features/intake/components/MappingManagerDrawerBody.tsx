import { useState } from 'react'
import { Box, Stack, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useCreateMapping } from '../hooks/useCreateMapping'
import { useUpdateMapping } from '../hooks/useUpdateMapping'
import { useDeleteMapping } from '../hooks/useDeleteMapping'
import { mappingFormDefaultValues } from '../schemas/mapping-form.schema'
import { mapMappingFormToPayload, mapMappingToFormValues } from '../utils/map-mapping-form-to-payload'
import { MappingCard } from './MappingCard'
import { MappingFormModal } from './MappingFormModal'
import type { IntakeMapping } from '../types'
import type { MappingTarget } from './MappingManagerDrawer'
import type { MappingFormValues } from '../schemas/mapping-form.schema'

interface MappingManagerDrawerBodyProps {
  target: MappingTarget
  intakeId: number
  versionId: number
  mappings: IntakeMapping[]
  onClose: () => void
}

export function MappingManagerDrawerBody({
  target,
  intakeId,
  versionId,
  mappings,
  onClose,
}: MappingManagerDrawerBodyProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const editingMapping = mappings.find((m) => m.id === editingId) ?? null

  const createMutation = useCreateMapping(intakeId, { onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateMapping(intakeId, { onSuccess: () => setEditingId(null) })
  const deleteMutation = useDeleteMapping(intakeId, { onSuccess: () => setDeletingId(null) })

  const isFormOpen = isCreateOpen || editingId !== null
  const formInitialValues: MappingFormValues = editingMapping
    ? mapMappingToFormValues(editingMapping)
    : mappingFormDefaultValues

  function handleSubmit(values: MappingFormValues) {
    const payload = mapMappingFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate({ versionId, payload: { ...payload, ...target } })
    } else if (editingId) {
      updateMutation.mutate({ mappingId: editingId, payload })
    }
  }

  return (
    <Box sx={{ width: 480, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack
        direction="row"
        sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Mapeo a historia clínica</Typography>
        <Button onClick={onClose}>Cerrar</Button>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {mappings.map((mapping) => (
            <MappingCard
              key={mapping.id}
              intakeId={intakeId}
              mapping={mapping}
              onEdit={() => setEditingId(mapping.id)}
              onDelete={() => setDeletingId(mapping.id)}
            />
          ))}
        </Stack>

        {mappings.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '13px', mb: 2 }}>
            Sin mapeos configurados todavía.
          </Typography>
        )}

        <AppButton startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => setIsCreateOpen(true)}>
          Agregar mapeo
        </AppButton>
      </Box>

      <MappingFormModal
        open={isFormOpen}
        mode={isCreateOpen ? 'create' : 'edit'}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingId(null)
        }}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar mapeo"
        description="¿Eliminar este mapeo? Se perderá su configuración de destino y sus interpretaciones."
        isConfirming={deleteMutation.isPending}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </Box>
  )
}

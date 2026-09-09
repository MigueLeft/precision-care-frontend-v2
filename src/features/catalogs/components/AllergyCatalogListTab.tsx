import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useAllergyCatalog } from '../hooks/useAllergyCatalog'
import { useAllergyTypes } from '../hooks/useAllergyTypes'
import { useCreateAllergyCatalog } from '../hooks/useCreateAllergyCatalog'
import { useUpdateAllergyCatalog } from '../hooks/useUpdateAllergyCatalog'
import { useToggleAllergyCatalogActive } from '../hooks/useToggleAllergyCatalogActive'
import { AllergyCatalogTable } from './AllergyCatalogTable'
import { AllergyCatalogFormModal } from './AllergyCatalogFormModal'
import {
  allergyCatalogFormDefaultValues,
  type AllergyCatalogFormValues,
} from '../schemas/allergy-catalog-form.schema'

export function AllergyCatalogListTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: allergies = [] } = useAllergyCatalog()
  const { data: types = [] } = useAllergyTypes()

  const createMutation = useCreateAllergyCatalog({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateAllergyCatalog({ onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleAllergyCatalogActive()

  const typeNameById = new Map(types.map((type) => [type.id, type.name]))
  const editing = allergies.find((allergy) => allergy.id === editingId) ?? null
  const isFormOpen = isCreateOpen || editingId !== null
  const initialValues: AllergyCatalogFormValues =
    isCreateOpen || !editing
      ? allergyCatalogFormDefaultValues
      : { name: editing.name, typeId: editing.typeId }

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: AllergyCatalogFormValues) {
    if (isCreateOpen) {
      createMutation.mutate(values)
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, payload: values })
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {allergies.length} alergias
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

      <AllergyCatalogTable
        items={allergies}
        typeNameById={typeNameById}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <AllergyCatalogFormModal
        open={isFormOpen}
        mode={isCreateOpen ? 'create' : 'edit'}
        initialValues={initialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </Box>
  )
}

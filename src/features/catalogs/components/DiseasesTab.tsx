import { useState } from 'react'
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useDiseases } from '../hooks/useDiseases'
import { useCreateDisease } from '../hooks/useCreateDisease'
import { useUpdateDisease } from '../hooks/useUpdateDisease'
import { useToggleDiseaseActive } from '../hooks/useToggleDiseaseActive'
import { DiseasesTable } from './DiseasesTable'
import { DiseaseFormModal } from './DiseaseFormModal'
import {
  diseaseFormDefaultValues,
  type DiseaseFormValues,
} from '../schemas/disease-form.schema'

export function DiseasesTab() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [onlyChronic, setOnlyChronic] = useState(false)

  const { data: diseases = [] } = useDiseases()
  const createMutation = useCreateDisease({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateDisease({ onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleDiseaseActive()

  const editing = diseases.find((disease) => disease.id === editingId) ?? null
  const filtered = onlyChronic ? diseases.filter((disease) => disease.isChronic) : diseases
  const isFormOpen = isCreateOpen || editingId !== null
  const initialValues: DiseaseFormValues =
    isCreateOpen || !editing
      ? diseaseFormDefaultValues
      : {
          name: editing.name,
          code: editing.code ?? '',
          isChronic: editing.isChronic,
          bodySystemId: editing.bodySystemId,
        }

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: DiseaseFormValues) {
    const payload = {
      name: values.name,
      code: values.code?.trim() || undefined,
      isChronic: values.isChronic,
      bodySystemId: values.bodySystemId,
    }
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, payload })
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} enfermedades
          </Typography>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={onlyChronic}
                onChange={(event) => setOnlyChronic(event.target.checked)}
              />
            }
            label="Solo crónicas"
          />
        </Stack>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Agregar
        </AppButton>
      </Stack>

      <DiseasesTable
        items={filtered}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <DiseaseFormModal
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

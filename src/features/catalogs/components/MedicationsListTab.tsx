import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useMedications } from '../hooks/useMedications'
import { useCreateMedication } from '../hooks/useCreateMedication'
import { useUpdateMedication } from '../hooks/useUpdateMedication'
import { useToggleMedicationActive } from '../hooks/useToggleMedicationActive'
import { useMedicationPresentations } from '../hooks/useMedicationPresentations'
import { useMedicationCategories } from '../hooks/useMedicationCategories'
import { filterMedications } from '../utils/filter-medications'
import { mapMedicationToFormValues } from '../utils/map-medication-to-form-values'
import { mapMedicationFormToPayload } from '../utils/map-medication-form-to-payload'
import { medicationFormDefaultValues } from '../schemas/medication-form.schema'
import { MedicationsToolbar } from './MedicationsToolbar'
import { MedicationsTable } from './MedicationsTable'
import { MedicationFormModal } from './MedicationFormModal'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

export function MedicationsListTab() {
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: medications = [] } = useMedications()
  const { data: presentations = [] } = useMedicationPresentations()
  const { data: categories = [] } = useMedicationCategories()

  const presentationNameById = new Map(presentations.map((p) => [p.id, p.name]))
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))
  const filtered = filterMedications(medications, { q, categoryId: categoryId || undefined, onlyActive })
  const editingMedication = medications.find((m) => m.id === editingId) ?? null

  const createMutation = useCreateMedication({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateMedication(editingId ?? undefined, { onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleMedicationActive()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: MedicationFormValues = isCreateOpen
    ? medicationFormDefaultValues
    : editingMedication
      ? mapMedicationToFormValues(editingMedication)
      : medicationFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: MedicationFormValues) {
    const payload = mapMedicationFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} medicamentos
      </Typography>

      <MedicationsToolbar
        q={q}
        categoryId={categoryId}
        categories={categories}
        onlyActive={onlyActive}
        onQChange={setQ}
        onCategoryChange={setCategoryId}
        onOnlyActiveChange={setOnlyActive}
        onAdd={() => setIsCreateOpen(true)}
      />

      <MedicationsTable
        medications={filtered}
        presentationNameById={presentationNameById}
        categoryNameById={categoryNameById}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <MedicationFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </Box>
  )
}

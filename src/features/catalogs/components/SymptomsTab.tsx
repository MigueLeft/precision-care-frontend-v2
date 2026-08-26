import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useSymptoms } from '../hooks/useSymptoms'
import { useCreateSymptom } from '../hooks/useCreateSymptom'
import { useUpdateSymptom } from '../hooks/useUpdateSymptom'
import { useToggleSymptomActive } from '../hooks/useToggleSymptomActive'
import { useBodySystems } from '../hooks/useBodySystems'
import { filterSymptoms } from '../utils/filter-symptoms'
import { mapSymptomToFormValues } from '../utils/map-symptom-to-form-values'
import { mapSymptomFormToPayload } from '../utils/map-symptom-form-to-payload'
import { symptomFormDefaultValues } from '../schemas/symptom-form.schema'
import { SymptomsToolbar } from './SymptomsToolbar'
import { SymptomsTable } from './SymptomsTable'
import { SymptomFormModal } from './SymptomFormModal'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

export function SymptomsTab() {
  const [q, setQ] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: symptoms = [] } = useSymptoms()
  const { data: bodySystems = [] } = useBodySystems()

  const bodySystemNameById = new Map(bodySystems.map((system) => [system.id, system.name]))
  const filtered = filterSymptoms(symptoms, { q, onlyActive })
  const editingSymptom = symptoms.find((s) => s.id === editingId) ?? null

  const createMutation = useCreateSymptom({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateSymptom(editingId ?? undefined, { onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleSymptomActive()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: SymptomFormValues = isCreateOpen
    ? symptomFormDefaultValues
    : editingSymptom
      ? mapSymptomToFormValues(editingSymptom)
      : symptomFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: SymptomFormValues) {
    const payload = mapSymptomFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} síntomas
      </Typography>

      <SymptomsToolbar
        q={q}
        onlyActive={onlyActive}
        onQChange={setQ}
        onOnlyActiveChange={setOnlyActive}
        onAdd={() => setIsCreateOpen(true)}
      />

      <SymptomsTable
        symptoms={filtered}
        bodySystemNameById={bodySystemNameById}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <SymptomFormModal
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

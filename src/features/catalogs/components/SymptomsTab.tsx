import { useState } from 'react'
import { Typography, Box, Tab, Tabs } from '@mui/material'
import { useSymptoms } from '../hooks/useSymptoms'
import { useCreateSymptom } from '../hooks/useCreateSymptom'
import { useUpdateSymptom } from '../hooks/useUpdateSymptom'
import { useToggleSymptomActive } from '../hooks/useToggleSymptomActive'
import { useSymptomSeverities } from '../hooks/useSymptomSeverities'
import { useCreateSymptomSeverity } from '../hooks/useCreateSymptomSeverity'
import { useUpdateSymptomSeverity } from '../hooks/useUpdateSymptomSeverity'
import { useToggleSymptomSeverityActive } from '../hooks/useToggleSymptomSeverityActive'
import { filterSymptoms } from '../utils/filter-symptoms'
import { mapSymptomToFormValues } from '../utils/map-symptom-to-form-values'
import { mapSymptomFormToPayload } from '../utils/map-symptom-form-to-payload'
import { symptomFormDefaultValues } from '../schemas/symptom-form.schema'
import { SymptomsToolbar } from './SymptomsToolbar'
import { SymptomsTable } from './SymptomsTable'
import { SymptomFormModal } from './SymptomFormModal'
import { SimpleCatalogList } from './SimpleCatalogList'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

const SUB_TABS = ['Síntomas', 'Severidad'] as const

export function SymptomsTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: severities = [] } = useSymptomSeverities()
  const createSeverity = useCreateSymptomSeverity()
  const updateSeverity = useUpdateSymptomSeverity()
  const toggleSeverity = useToggleSymptomSeverityActive()

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ mb: 3, minHeight: 36, '& .MuiTab-root': { minHeight: 36, fontSize: '13px' } }}
      >
        {SUB_TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {subTab === 0 && <SymptomCatalogList />}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Severidad de síntomas"
          items={severities}
          isCreating={createSeverity.isPending}
          isUpdating={updateSeverity.isPending}
          onCreate={(values) => createSeverity.mutate(values.name)}
          onUpdate={(id, values) => updateSeverity.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleSeverity.mutate(id)}
        />
      )}
    </Box>
  )
}

function SymptomCatalogList() {
  const [q, setQ] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: symptoms = [] } = useSymptoms()

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

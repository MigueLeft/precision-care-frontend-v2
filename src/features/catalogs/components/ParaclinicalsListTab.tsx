import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useParaclinicals } from '../hooks/useParaclinicals'
import { useCreateParaclinical } from '../hooks/useCreateParaclinical'
import { useUpdateParaclinical } from '../hooks/useUpdateParaclinical'
import { useToggleParaclinicalActive } from '../hooks/useToggleParaclinicalActive'
import { useParaclinicalCategories } from '../hooks/useParaclinicalCategories'
import { filterParaclinicals } from '../utils/filter-paraclinicals'
import { mapParaclinicalToFormValues } from '../utils/map-paraclinical-to-form-values'
import { mapParaclinicalFormToPayload } from '../utils/map-paraclinical-form-to-payload'
import { paraclinicalFormDefaultValues } from '../schemas/paraclinical-form.schema'
import { ParaclinicalsToolbar } from './ParaclinicalsToolbar'
import { ParaclinicalsTable } from './ParaclinicalsTable'
import { ParaclinicalFormModal } from './ParaclinicalFormModal'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

export function ParaclinicalsListTab() {
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]))

  const filtered = filterParaclinicals(paraclinicals, {
    q,
    categoryId: categoryId || undefined,
    onlyActive,
  })
  const editing = paraclinicals.find((e) => e.id === editingId) ?? null
  const existingNames = paraclinicals
    .filter((e) => e.id !== editingId)
    .map((e) => e.name)

  const createMutation = useCreateParaclinical({
    onSuccess: () => setIsCreateOpen(false),
  })
  const updateMutation = useUpdateParaclinical(editingId ?? undefined, {
    onSuccess: () => setEditingId(null),
  })
  const toggleActiveMutation = useToggleParaclinicalActive()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: ParaclinicalFormValues = isCreateOpen
    ? paraclinicalFormDefaultValues
    : editing
      ? mapParaclinicalToFormValues(editing)
      : paraclinicalFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: ParaclinicalFormValues) {
    const payload = mapParaclinicalFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} paraclínicos
      </Typography>

      <ParaclinicalsToolbar
        q={q}
        categoryId={categoryId}
        categories={categories}
        onlyActive={onlyActive}
        onQChange={setQ}
        onCategoryChange={setCategoryId}
        onOnlyActiveChange={setOnlyActive}
        onAdd={() => setIsCreateOpen(true)}
      />

      <ParaclinicalsTable
        paraclinicals={filtered}
        categoryNameById={categoryNameById}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <ParaclinicalFormModal
        open={isFormOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        existingNames={existingNames}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </Box>
  )
}

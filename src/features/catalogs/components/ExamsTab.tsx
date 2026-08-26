import { useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useExams } from '../hooks/useExams'
import { useCreateExam } from '../hooks/useCreateExam'
import { useUpdateExam } from '../hooks/useUpdateExam'
import { useToggleExamActive } from '../hooks/useToggleExamActive'
import { filterExams } from '../utils/filter-exams'
import { mapExamToFormValues } from '../utils/map-exam-to-form-values'
import { mapExamFormToPayload } from '../utils/map-exam-form-to-payload'
import { examFormDefaultValues } from '../schemas/exam-form.schema'
import { ExamsToolbar } from './ExamsToolbar'
import { ExamsTable } from './ExamsTable'
import { ExamFormModal } from './ExamFormModal'
import type { ExamFormValues } from '../schemas/exam-form.schema'
import type { ExamCategory } from '../types'

export function ExamsTab() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<ExamCategory | ''>('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: exams = [] } = useExams()

  const filtered = filterExams(exams, { q, category: category || undefined, onlyActive })
  const editingExam = exams.find((e) => e.id === editingId) ?? null

  const createMutation = useCreateExam({ onSuccess: () => setIsCreateOpen(false) })
  const updateMutation = useUpdateExam(editingId ?? undefined, { onSuccess: () => setEditingId(null) })
  const toggleActiveMutation = useToggleExamActive()

  const isFormOpen = isCreateOpen || editingId !== null
  const formMode = isCreateOpen ? 'create' : 'edit'
  const formInitialValues: ExamFormValues = isCreateOpen
    ? examFormDefaultValues
    : editingExam
      ? mapExamToFormValues(editingExam)
      : examFormDefaultValues

  function closeForm() {
    setIsCreateOpen(false)
    setEditingId(null)
  }

  function handleSubmit(values: ExamFormValues) {
    const payload = mapExamFormToPayload(values)
    if (isCreateOpen) {
      createMutation.mutate(payload)
    } else if (editingId) {
      updateMutation.mutate(payload)
    }
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} exámenes
      </Typography>

      <ExamsToolbar
        q={q}
        category={category}
        onlyActive={onlyActive}
        onQChange={setQ}
        onCategoryChange={setCategory}
        onOnlyActiveChange={setOnlyActive}
        onAdd={() => setIsCreateOpen(true)}
      />

      <ExamsTable
        exams={filtered}
        onEdit={(id) => setEditingId(id)}
        onToggleActive={(id) => toggleActiveMutation.mutate(id)}
      />

      <ExamFormModal
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

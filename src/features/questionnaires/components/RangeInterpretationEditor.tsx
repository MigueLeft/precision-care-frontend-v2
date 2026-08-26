import { useState } from 'react'
import { Box, Stack, TextField, Typography, IconButton, Chip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import { useCreateRangeInterpretation } from '../hooks/useCreateRangeInterpretation'
import { useUpdateRangeInterpretation } from '../hooks/useUpdateRangeInterpretation'
import { useDeleteRangeInterpretation } from '../hooks/useDeleteRangeInterpretation'
import type { RangeInterpretation } from '../types'

interface RangeInterpretationEditorProps {
  questionnaireId: number
  mappingId: number
  interpretations: RangeInterpretation[]
}

const EMPTY_FORM = { minScore: '', maxScore: '', interpretation: '', color: '' }

export function RangeInterpretationEditor({
  questionnaireId,
  mappingId,
  interpretations,
}: RangeInterpretationEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const createMutation = useCreateRangeInterpretation(questionnaireId, {
    onSuccess: () => setForm(EMPTY_FORM),
  })
  const updateMutation = useUpdateRangeInterpretation(questionnaireId, {
    onSuccess: () => {
      setEditingId(null)
      setForm(EMPTY_FORM)
    },
  })
  const deleteMutation = useDeleteRangeInterpretation(questionnaireId)

  function startEdit(item: RangeInterpretation) {
    setEditingId(item.id)
    setForm({
      minScore: item.minScore,
      maxScore: item.maxScore,
      interpretation: item.interpretation,
      color: item.color ?? '',
    })
  }

  function submit() {
    const payload = {
      minScore: Number(form.minScore),
      maxScore: Number(form.maxScore),
      interpretation: form.interpretation,
      color: form.color || undefined,
    }
    if (editingId) {
      updateMutation.mutate({ interpretationId: editingId, payload })
    } else {
      createMutation.mutate({ mappingId, payload })
    }
  }

  const isValid = form.minScore !== '' && form.maxScore !== '' && form.interpretation.trim() !== ''

  return (
    <Box sx={{ mt: 1.5, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Interpretación por rango de puntaje
      </Typography>

      <Stack spacing={1} sx={{ mb: 1.5 }}>
        {interpretations.map((item) => (
          <Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip label={`${item.minScore}–${item.maxScore}`} size="small" />
            <Typography sx={{ fontSize: '13px' }}>{item.interpretation}</Typography>
            <IconButton size="small" onClick={() => startEdit(item)} aria-label="Editar interpretación">
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => deleteMutation.mutate(item.id)}
              aria-label="Eliminar interpretación"
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Mín"
          type="number"
          size="small"
          value={form.minScore}
          onChange={(e) => setForm((f) => ({ ...f, minScore: e.target.value }))}
          sx={{ width: 90 }}
        />
        <TextField
          label="Máx"
          type="number"
          size="small"
          value={form.maxScore}
          onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))}
          sx={{ width: 90 }}
        />
        <TextField
          label="Interpretación"
          size="small"
          value={form.interpretation}
          onChange={(e) => setForm((f) => ({ ...f, interpretation: e.target.value }))}
          sx={{ flex: 1, minWidth: 160 }}
        />
        <TextField
          label="Color"
          size="small"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          sx={{ width: 110 }}
        />
        <AppButton
          size="small"
          disabled={!isValid}
          loading={createMutation.isPending || updateMutation.isPending}
          onClick={submit}
        >
          {editingId ? 'Guardar' : 'Agregar'}
        </AppButton>
      </Stack>
    </Box>
  )
}

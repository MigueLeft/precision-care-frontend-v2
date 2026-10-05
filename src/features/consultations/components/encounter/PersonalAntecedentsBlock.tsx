import { useState } from 'react'
import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import {
  AntecedentListTable,
  useAntecedentDiseaseOptions,
  useCreateAntecedent,
  useDeleteAntecedent,
  ANTECEDENT_STATUS_LABELS,
} from '@/features/antecedents'
import type { Antecedent, AntecedentStatus } from '@/features/antecedents'

const STATUSES = Object.keys(ANTECEDENT_STATUS_LABELS) as AntecedentStatus[]

interface PersonalAntecedentsBlockProps {
  patientId: number
  antecedents: Antecedent[]
  readOnly: boolean
  onEdit: (antecedent: Antecedent) => void
}

export function PersonalAntecedentsBlock({
  patientId,
  antecedents,
  readOnly,
  onEdit,
}: PersonalAntecedentsBlockProps) {
  const createMutation = useCreateAntecedent(patientId, { onSuccess: () => reset() })
  const deleteMutation = useDeleteAntecedent(patientId)
  const diseaseOptions = useAntecedentDiseaseOptions()
  const [condition, setCondition] = useState<CatalogPick | null>(null)
  const [since, setSince] = useState('')
  const [status, setStatus] = useState<AntecedentStatus>('active')
  const [notes, setNotes] = useState('')

  function reset() {
    setCondition(null)
    setSince('')
    setStatus('active')
    setNotes('')
  }

  function submit() {
    if (!condition?.name.trim()) {
      toast.error('Selecciona la condición o padecimiento del catálogo.')
      return
    }
    createMutation.mutate({
      patientId,
      type: 'personal',
      name: condition.name.trim(),
      diseaseCatalogId: condition.catalogId,
      eventDate: since || undefined,
      status,
      description: notes.trim() || undefined,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
        Antecedentes personales
        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
          {antecedents.length} {antecedents.length === 1 ? 'registro' : 'registros'}
        </Typography>
      </Typography>

      <AntecedentListTable
        antecedents={antecedents}
        variant="personal"
        onEdit={readOnly ? undefined : onEdit}
        onDelete={(antecedent) => {
          if (!readOnly) deleteMutation.mutate(antecedent.id)
        }}
      />

      {!readOnly && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <CatalogPicker
            options={diseaseOptions}
            value={condition}
            onChange={setCondition}
            placeholder="Buscar condición o padecimiento…"
            sx={{ flex: '1 1 260px', minWidth: 220 }}
          />
          <TextField
            size="small"
            type="date"
            label="Desde"
            slotProps={{ inputLabel: { shrink: true } }}
            value={since}
            onChange={(event) => setSince(event.target.value)}
            sx={{ width: 160 }}
          />
          <Select
            size="small"
            value={status}
            onChange={(event) => setStatus(event.target.value as AntecedentStatus)}
            sx={{ minWidth: 150 }}
          >
            {STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {ANTECEDENT_STATUS_LABELS[value]}
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder="Notas…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            sx={{ flex: '1 1 200px', minWidth: 180 }}
          />
          <AppButton
            variant="outlined"
            loading={createMutation.isPending}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={submit}
          >
            Añadir
          </AppButton>
        </Stack>
      )}
    </Stack>
  )
}

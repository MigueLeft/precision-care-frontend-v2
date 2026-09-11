import { useState } from 'react'
import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import {
  SurgeryHospitalizationList,
  useCreateAntecedent,
  useDeleteAntecedent,
  isMockAntecedent,
} from '@/features/antecedents'
import type { Antecedent, AntecedentType } from '@/features/antecedents'

interface SurgicalAntecedentsBlockProps {
  patientId: number
  antecedents: Antecedent[]
  readOnly: boolean
}

export function SurgicalAntecedentsBlock({
  patientId,
  antecedents,
  readOnly,
}: SurgicalAntecedentsBlockProps) {
  const createMutation = useCreateAntecedent(patientId, { onSuccess: () => reset() })
  const deleteMutation = useDeleteAntecedent(patientId)
  const [type, setType] = useState<Extract<AntecedentType, 'surgery' | 'hospitalization'>>('surgery')
  const [procedure, setProcedure] = useState('')
  const [date, setDate] = useState('')
  const [complications, setComplications] = useState('')

  function reset() {
    setProcedure('')
    setDate('')
    setComplications('')
  }

  function submit() {
    if (!procedure.trim()) {
      toast.error('Indica el procedimiento o motivo.')
      return
    }
    createMutation.mutate({
      patientId,
      type,
      name: procedure.trim(),
      eventDate: date || undefined,
      description: complications.trim() || undefined,
      surgeryDetail:
        type === 'surgery'
          ? { procedure: procedure.trim(), complications: complications.trim() || undefined }
          : undefined,
      hospitalizationDetail:
        type === 'hospitalization'
          ? { reason: procedure.trim(), admissionDate: date || undefined }
          : undefined,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
        Cirugías y hospitalizaciones
        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
          {antecedents.length} {antecedents.length === 1 ? 'evento' : 'eventos'}
        </Typography>
      </Typography>

      <SurgeryHospitalizationList
        antecedents={antecedents}
        onDelete={(antecedent) => {
          if (isMockAntecedent(antecedent)) {
            toast.info('Este es un registro de ejemplo.')
            return
          }
          if (!readOnly) deleteMutation.mutate(antecedent.id)
        }}
      />

      {!readOnly && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Select
            size="small"
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="surgery">Cirugía</MenuItem>
            <MenuItem value="hospitalization">Hospitalización</MenuItem>
          </Select>
          <TextField
            size="small"
            placeholder="Procedimiento o motivo…"
            value={procedure}
            onChange={(event) => setProcedure(event.target.value)}
            sx={{ flex: '1 1 220px', minWidth: 200 }}
          />
          <TextField
            size="small"
            type="date"
            label="Fecha"
            slotProps={{ inputLabel: { shrink: true } }}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            sx={{ width: 160 }}
          />
          <TextField
            size="small"
            placeholder="Complicaciones…"
            value={complications}
            onChange={(event) => setComplications(event.target.value)}
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

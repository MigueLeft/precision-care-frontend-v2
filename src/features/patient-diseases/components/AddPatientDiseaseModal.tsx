import { useState } from 'react'
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useBodySystems, useDiseases } from '@/features/catalogs'
import type { Disease } from '@/features/catalogs'
import { DISEASE_STATUS_LABELS } from '@/features/consultations'
import type { DiseaseStatus } from '@/features/consultations'
import type { AddPatientDiseaseInput } from '../types'

interface AddPatientDiseaseModalProps {
  open: boolean
  isSaving: boolean
  onSubmit: (input: AddPatientDiseaseInput) => void
  onClose: () => void
}

const STATUSES = Object.keys(DISEASE_STATUS_LABELS) as DiseaseStatus[]

export function AddPatientDiseaseModal({
  open,
  isSaving,
  onSubmit,
  onClose,
}: AddPatientDiseaseModalProps) {
  const { data: catalog = [] } = useDiseases()
  const { data: bodySystems = [] } = useBodySystems()

  const [manual, setManual] = useState(false)
  const [selected, setSelected] = useState<Disease | null>(null)
  const [manualName, setManualName] = useState('')
  const [code, setCode] = useState('')
  const [isChronic, setIsChronic] = useState(false)
  const [bodySystemId, setBodySystemId] = useState<number | ''>('')
  const [status, setStatus] = useState<DiseaseStatus>('active')
  const [dxDate, setDxDate] = useState('')
  const [notes, setNotes] = useState('')

  function submit() {
    if (!manual && !selected) {
      toast.error('Elige una enfermedad del catálogo o marca "escribir manualmente".')
      return
    }
    if (manual && !manualName.trim()) {
      toast.error('Indica la enfermedad.')
      return
    }
    if (!bodySystemId) {
      toast.error('Selecciona el aparato o sistema.')
      return
    }
    onSubmit({
      diseaseCatalogId: manual ? undefined : selected!.id,
      name: manual ? manualName.trim() : undefined,
      code: manual ? code.trim() || undefined : undefined,
      isChronic: manual ? isChronic : undefined,
      bodySystemId: Number(bodySystemId),
      status,
      dxDate: dxDate.trim() || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir enfermedad</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={manual}
                onChange={(event) => {
                  setManual(event.target.checked)
                  setSelected(null)
                  setManualName('')
                }}
              />
            }
            label="No está en el catálogo · escribir manualmente"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
          />

          {manual ? (
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                label="Enfermedad o diagnóstico"
                value={manualName}
                onChange={(event) => setManualName(event.target.value)}
              />
              <TextField
                size="small"
                label="Código"
                placeholder="Ej. E11.9"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                sx={{ width: 120 }}
              />
            </Stack>
          ) : (
            <Autocomplete
              options={catalog.filter((d) => d.active)}
              getOptionLabel={(option) => option.name}
              value={selected}
              onChange={(_event, option) => setSelected(option)}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Enfermedad del catálogo" />
              )}
            />
          )}

          {manual && (
            <FormControlLabel
              control={
                <Checkbox size="small" checked={isChronic} onChange={(e) => setIsChronic(e.target.checked)} />
              }
              label="Enfermedad crónica"
            />
          )}

          <FormControl size="small" fullWidth>
            <InputLabel id="pd-system">Aparato / sistema</InputLabel>
            <Select<number | ''>
              labelId="pd-system"
              label="Aparato / sistema"
              value={bodySystemId}
              onChange={(event) =>
                setBodySystemId(event.target.value === '' ? '' : Number(event.target.value))
              }
            >
              {bodySystems.map((system) => (
                <MenuItem key={system.id} value={system.id}>
                  {system.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="pd-status">Estado</InputLabel>
              <Select
                labelId="pd-status"
                label="Estado"
                value={status}
                onChange={(event) => setStatus(event.target.value as DiseaseStatus)}
              >
                {STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {DISEASE_STATUS_LABELS[value]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Fecha dx"
              placeholder="Ej. 2020-01"
              value={dxDate}
              onChange={(event) => setDxDate(event.target.value)}
            />
          </Stack>

          <TextField
            size="small"
            label="Nota"
            multiline
            minRows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSaving} onClick={submit}>
          Añadir
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

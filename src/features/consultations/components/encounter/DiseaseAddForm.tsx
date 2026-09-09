import { useState } from 'react'
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useDiseases } from '@/features/catalogs'
import type { Disease } from '@/features/catalogs'
import {
  DISEASE_STATUS_LABELS,
  diseaseStatusOptions,
} from '../../utils/consultation-format'
import type { AddDiseaseInput, DiseaseStatus } from '../../types'

interface DiseaseAddFormProps {
  onAdd: (input: AddDiseaseInput) => void
  isAdding: boolean
  usedCatalogIds: Set<number>
}

export function DiseaseAddForm({ onAdd, isAdding, usedCatalogIds }: DiseaseAddFormProps) {
  const { data: catalog = [] } = useDiseases()

  const [manual, setManual] = useState(false)
  const [onlyChronic, setOnlyChronic] = useState(false)
  const [selected, setSelected] = useState<Disease | null>(null)
  const [manualName, setManualName] = useState('')
  const [manualChronic, setManualChronic] = useState(false)
  const [status, setStatus] = useState<DiseaseStatus>('active')
  const [dxDate, setDxDate] = useState('')

  const options = catalog.filter(
    (disease) =>
      disease.active &&
      !usedCatalogIds.has(disease.id) &&
      (!onlyChronic || disease.isChronic),
  )

  // El set de estados depende de si la enfermedad elegida es crónica.
  const isChronic = manual ? manualChronic : (selected?.isChronic ?? false)
  const statusOptions = diseaseStatusOptions(isChronic)

  function reset() {
    setSelected(null)
    setManualName('')
    setManualChronic(false)
    setStatus('active')
    setDxDate('')
  }

  function submit() {
    if (manual && !manualName.trim()) {
      toast.error('Indica la enfermedad o diagnóstico.')
      return
    }
    if (!manual && !selected) {
      toast.error('Elige una enfermedad del catálogo o marca "escribir manualmente".')
      return
    }
    onAdd({
      diseaseCatalogId: manual ? undefined : selected!.id,
      name: manual ? manualName.trim() : undefined,
      isChronic: manual ? manualChronic : undefined,
      status: statusOptions.includes(status) ? status : statusOptions[0],
      dxDate: dxDate.trim() || undefined,
    })
    reset()
  }

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={onlyChronic}
              onChange={(event) => setOnlyChronic(event.target.checked)}
            />
          }
          label="Solo enfermedades crónicas"
        />
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
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        {manual ? (
          <>
            <TextField
              size="small"
              sx={{ flex: 1, minWidth: 220 }}
              placeholder="Enfermedad o diagnóstico…"
              value={manualName}
              onChange={(event) => setManualName(event.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={manualChronic}
                  onChange={(event) => setManualChronic(event.target.checked)}
                />
              }
              label="Crónica"
            />
          </>
        ) : (
          <Autocomplete
            sx={{ flex: 1, minWidth: 220 }}
            options={options}
            getOptionLabel={(option) => option.name}
            value={selected}
            onChange={(_event, option) => setSelected(option)}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Buscar enfermedad…" />
            )}
          />
        )}

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="disease-status">Estado</InputLabel>
          <Select
            labelId="disease-status"
            label="Estado"
            value={statusOptions.includes(status) ? status : statusOptions[0]}
            onChange={(event) => setStatus(event.target.value as DiseaseStatus)}
          >
            {statusOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {DISEASE_STATUS_LABELS[value]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Fecha dx"
          placeholder="Vacío = fecha de consulta"
          value={dxDate}
          onChange={(event) => setDxDate(event.target.value)}
          sx={{ width: 160 }}
        />

        <AppButton
          variant="outlined"
          loading={isAdding}
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={submit}
        >
          Añadir
        </AppButton>
      </Stack>
    </Stack>
  )
}

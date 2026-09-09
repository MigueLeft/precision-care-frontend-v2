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
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useBodySystems, useDiseases } from '@/features/catalogs'
import { DISEASE_STATUS_LABELS } from '../../utils/consultation-format'
import type { AddDiseaseInput, DiseaseStatus } from '../../types'

interface DiseaseAddFormProps {
  onAdd: (input: AddDiseaseInput) => void
  isAdding: boolean
}

const STATUSES = Object.keys(DISEASE_STATUS_LABELS) as DiseaseStatus[]

export function DiseaseAddForm({ onAdd, isAdding }: DiseaseAddFormProps) {
  const { data: catalog = [] } = useDiseases()
  const { data: bodySystems = [] } = useBodySystems()

  const [onlyChronic, setOnlyChronic] = useState(false)
  const [name, setName] = useState('')
  const [catalogId, setCatalogId] = useState<number | undefined>(undefined)
  const [bodySystemId, setBodySystemId] = useState<number | ''>('')
  const [status, setStatus] = useState<DiseaseStatus>('active')
  const [dxDate, setDxDate] = useState('')

  const options = catalog.filter(
    (disease) => disease.active && (!onlyChronic || disease.isChronic),
  )

  function reset() {
    setName('')
    setCatalogId(undefined)
    setBodySystemId('')
    setStatus('active')
    setDxDate('')
  }

  function submit() {
    if (!catalogId && !name.trim()) {
      toast.error('Indica la enfermedad o diagnóstico.')
      return
    }
    if (!bodySystemId) {
      toast.error('Selecciona el aparato o sistema.')
      return
    }
    onAdd({
      diseaseCatalogId: catalogId,
      name: catalogId ? undefined : name.trim(),
      bodySystemId: Number(bodySystemId),
      status,
      dxDate: dxDate.trim() || undefined,
    })
    reset()
  }

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
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
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        <Autocomplete
          freeSolo
          sx={{ flex: 1, minWidth: 220 }}
          options={options}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          inputValue={name}
          onInputChange={(_event, value) => {
            setName(value)
            setCatalogId(undefined)
          }}
          onChange={(_event, option) => {
            if (option && typeof option !== 'string') {
              setCatalogId(option.id)
              setName(option.name)
            }
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="Enfermedad o diagnóstico…" />
          )}
        />

        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="disease-system">Aparato / sistema</InputLabel>
          <Select<number | ''>
            labelId="disease-system"
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

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="disease-status">Estado</InputLabel>
          <Select
            labelId="disease-status"
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
          placeholder="Fecha dx"
          value={dxDate}
          onChange={(event) => setDxDate(event.target.value)}
          sx={{ width: 120 }}
        />

        <AppButton variant="outlined" loading={isAdding} onClick={submit}>
          Añadir
        </AppButton>
      </Stack>
    </Stack>
  )
}

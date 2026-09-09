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
import { useBodySystems, useDiseases } from '@/features/catalogs'
import type { Disease } from '@/features/catalogs'
import { DISEASE_STATUS_LABELS } from '../../utils/consultation-format'
import type { AddDiseaseInput, DiseaseStatus } from '../../types'

interface DiseaseAddFormProps {
  onAdd: (input: AddDiseaseInput) => void
  isAdding: boolean
  usedCatalogIds: Set<number>
}

const STATUSES = Object.keys(DISEASE_STATUS_LABELS) as DiseaseStatus[]

export function DiseaseAddForm({ onAdd, isAdding, usedCatalogIds }: DiseaseAddFormProps) {
  const { data: catalog = [] } = useDiseases()
  const { data: bodySystems = [] } = useBodySystems()

  const [manual, setManual] = useState(false)
  const [onlyChronic, setOnlyChronic] = useState(false)
  const [selected, setSelected] = useState<Disease | null>(null)
  const [manualName, setManualName] = useState('')
  const [bodySystemId, setBodySystemId] = useState<number | ''>('')
  const [status, setStatus] = useState<DiseaseStatus>('active')
  const [dxDate, setDxDate] = useState('')

  const options = catalog.filter(
    (disease) =>
      disease.active &&
      !usedCatalogIds.has(disease.id) &&
      (!onlyChronic || disease.isChronic),
  )

  function reset() {
    setSelected(null)
    setManualName('')
    setBodySystemId('')
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
    if (!bodySystemId) {
      toast.error('Selecciona el aparato o sistema.')
      return
    }
    onAdd({
      diseaseCatalogId: manual ? undefined : selected!.id,
      name: manual ? manualName.trim() : undefined,
      bodySystemId: Number(bodySystemId),
      status,
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
          <TextField
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            placeholder="Enfermedad o diagnóstico…"
            value={manualName}
            onChange={(event) => setManualName(event.target.value)}
          />
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

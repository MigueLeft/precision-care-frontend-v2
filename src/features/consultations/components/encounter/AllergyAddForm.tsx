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
import { useAllergyCatalog, useAllergySeverities, useAllergyTypes } from '@/features/catalogs'
import type { AllergyCatalog } from '@/features/catalogs'
import type { AddAllergyInput } from '../../types'

interface AllergyAddFormProps {
  onAdd: (input: AddAllergyInput) => void
  isAdding: boolean
  // Ids de alergia (catálogo) ya capturadas en esta consulta, para no repetirlas.
  usedCatalogIds: Set<number>
}

export function AllergyAddForm({ onAdd, isAdding, usedCatalogIds }: AllergyAddFormProps) {
  const { data: catalog = [] } = useAllergyCatalog()
  const { data: types = [] } = useAllergyTypes()
  const { data: severities = [] } = useAllergySeverities()

  const [manual, setManual] = useState(false)
  const [typeId, setTypeId] = useState<number | ''>('')
  const [selected, setSelected] = useState<AllergyCatalog | null>(null)
  const [manualName, setManualName] = useState('')
  const [severityId, setSeverityId] = useState<number | ''>('')
  const [onsetYear, setOnsetYear] = useState('')
  const [reaction, setReaction] = useState('')

  const options = catalog.filter(
    (item) =>
      item.active &&
      !usedCatalogIds.has(item.id) &&
      (typeId === '' || item.typeId === typeId),
  )

  function reset() {
    setTypeId('')
    setSelected(null)
    setManualName('')
    setSeverityId('')
    setOnsetYear('')
    setReaction('')
  }

  function submit() {
    if (!severityId) {
      toast.error('Selecciona la severidad de la alergia.')
      return
    }
    if (manual && (!manualName.trim() || !typeId)) {
      toast.error('Indica el agente causal y su tipo.')
      return
    }
    if (!manual && !selected) {
      toast.error('Elige una alergia del catálogo o marca "escribir manualmente".')
      return
    }
    const year = onsetYear ? Number(onsetYear) : undefined
    onAdd({
      allergyCatalogId: manual ? undefined : selected!.id,
      name: manual ? manualName.trim() : undefined,
      typeId: manual ? Number(typeId) : undefined,
      severityId: Number(severityId),
      reaction: reaction.trim() || undefined,
      onsetYear: year && !Number.isNaN(year) ? year : undefined,
    })
    reset()
  }

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        <FormControl size="small" sx={{ minWidth: 150 }} disabled={!manual && !!selected}>
          <InputLabel id="allergy-type">Tipo</InputLabel>
          <Select<number | ''>
            labelId="allergy-type"
            label="Tipo"
            value={typeId}
            onChange={(event) => {
              setTypeId(event.target.value === '' ? '' : Number(event.target.value))
              if (selected) setSelected(null)
            }}
          >
            {types
              .filter((type) => type.active)
              .map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {manual ? (
          <TextField
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            placeholder="Agente causal…"
            value={manualName}
            onChange={(event) => setManualName(event.target.value)}
          />
        ) : (
          <Autocomplete
            sx={{ flex: 1, minWidth: 200 }}
            options={options}
            getOptionLabel={(option) => option.name}
            value={selected}
            onChange={(_event, option) => {
              setSelected(option)
              if (option) setTypeId(option.typeId)
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Buscar agente…" />
            )}
          />
        )}

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="allergy-severity">Severidad</InputLabel>
          <Select<number | ''>
            labelId="allergy-severity"
            label="Severidad"
            value={severityId}
            onChange={(event) =>
              setSeverityId(event.target.value === '' ? '' : Number(event.target.value))
            }
          >
            {severities
              .filter((severity) => severity.active)
              .map((severity) => (
                <MenuItem key={severity.id} value={severity.id}>
                  {severity.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="number"
          placeholder="Año"
          value={onsetYear}
          onChange={(event) => setOnsetYear(event.target.value)}
          sx={{ width: 90 }}
        />
      </Stack>

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
        label="El agente no está en el catálogo · escribir manualmente"
        sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
      />

      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          placeholder="Reacción observada…"
          value={reaction}
          onChange={(event) => setReaction(event.target.value)}
        />
        <AppButton
          variant="outlined"
          loading={isAdding}
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={submit}
        >
          Añadir alergia
        </AppButton>
      </Stack>
    </Stack>
  )
}

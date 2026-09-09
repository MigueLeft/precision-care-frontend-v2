import { useState } from 'react'
import {
  Autocomplete,
  FormControl,
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
import type { AddAllergyInput } from '../../types'

interface AllergyAddFormProps {
  onAdd: (input: AddAllergyInput) => void
  isAdding: boolean
}

export function AllergyAddForm({ onAdd, isAdding }: AllergyAddFormProps) {
  const { data: catalog = [] } = useAllergyCatalog()
  const { data: types = [] } = useAllergyTypes()
  const { data: severities = [] } = useAllergySeverities()

  const [typeId, setTypeId] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [catalogId, setCatalogId] = useState<number | undefined>(undefined)
  const [severityId, setSeverityId] = useState<number | ''>('')
  const [onsetYear, setOnsetYear] = useState('')
  const [reaction, setReaction] = useState('')

  // Si hay un tipo elegido, el catálogo de agentes se limita a ese tipo.
  const options = catalog.filter(
    (item) => item.active && (typeId === '' || item.typeId === typeId),
  )

  function reset() {
    setTypeId('')
    setName('')
    setCatalogId(undefined)
    setSeverityId('')
    setOnsetYear('')
    setReaction('')
  }

  function submit() {
    if (!severityId) {
      toast.error('Selecciona la gravedad de la alergia.')
      return
    }
    if (!catalogId && (!name.trim() || !typeId)) {
      toast.error('Indica el agente causal y su tipo.')
      return
    }
    const year = onsetYear ? Number(onsetYear) : undefined
    onAdd({
      allergyCatalogId: catalogId,
      name: catalogId ? undefined : name.trim(),
      typeId: catalogId ? undefined : Number(typeId),
      severityId: Number(severityId),
      reaction: reaction.trim() || undefined,
      onsetYear: year && !Number.isNaN(year) ? year : undefined,
    })
    reset()
  }

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
        <FormControl size="small" sx={{ minWidth: 150 }} disabled={!!catalogId}>
          <InputLabel id="allergy-type">Tipo</InputLabel>
          <Select<number | ''>
            labelId="allergy-type"
            label="Tipo"
            value={typeId}
            onChange={(event) => {
              const next = event.target.value === '' ? '' : Number(event.target.value)
              setTypeId(next)
              // Al cambiar el tipo a mano se limpia el agente elegido de otro tipo.
              if (catalogId) {
                setCatalogId(undefined)
                setName('')
              }
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

        <Autocomplete
          freeSolo
          sx={{ flex: 1, minWidth: 200 }}
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
              setTypeId(option.typeId)
            }
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="Agente causal…" />
          )}
        />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="allergy-severity">Gravedad</InputLabel>
          <Select<number | ''>
            labelId="allergy-severity"
            label="Gravedad"
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

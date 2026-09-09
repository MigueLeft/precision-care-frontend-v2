import { useState } from 'react'
import { Autocomplete, Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useMedications } from '@/features/catalogs'
import type { AddMedicationInput } from '../../types'

interface MedicationAddFormProps {
  onAdd: (input: AddMedicationInput) => void
  isAdding: boolean
}

export function MedicationAddForm({ onAdd, isAdding }: MedicationAddFormProps) {
  const { data: catalog = [] } = useMedications()

  const [medicationId, setMedicationId] = useState<number | null>(null)
  const [medicationLabel, setMedicationLabel] = useState('')
  const [dose, setDose] = useState('')
  const [frequency, setFrequency] = useState('')

  const options = catalog.filter((item) => item.active)

  function reset() {
    setMedicationId(null)
    setMedicationLabel('')
    setDose('')
    setFrequency('')
  }

  function submit() {
    if (!medicationId) {
      toast.error('Selecciona un medicamento del catálogo.')
      return
    }
    onAdd({
      medicationId,
      dose: dose.trim() || undefined,
      frequency: frequency.trim() || undefined,
    })
    reset()
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mt: 1 }}>
      <Autocomplete
        sx={{ flex: 1, minWidth: 220 }}
        options={options}
        getOptionLabel={(option) =>
          `${option.brandName} · ${option.genericName}${
            option.concentration ? ` ${option.concentration}` : ''
          }`
        }
        value={options.find((m) => m.id === medicationId) ?? null}
        inputValue={medicationLabel}
        onInputChange={(_event, value) => setMedicationLabel(value)}
        onChange={(_event, option) => setMedicationId(option?.id ?? null)}
        renderInput={(params) => (
          <TextField {...params} size="small" placeholder="Medicamento…" />
        )}
      />
      <TextField
        size="small"
        placeholder="Dosis"
        value={dose}
        onChange={(event) => setDose(event.target.value)}
        sx={{ width: { md: 120 } }}
      />
      <TextField
        size="small"
        placeholder="Frecuencia"
        value={frequency}
        onChange={(event) => setFrequency(event.target.value)}
        sx={{ flex: { md: 1 }, minWidth: 160 }}
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
  )
}

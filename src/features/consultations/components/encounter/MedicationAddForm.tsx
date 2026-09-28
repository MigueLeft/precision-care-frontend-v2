import { useState } from 'react'
import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useMedications } from '@/features/catalogs'
import { ManualMedicationFields } from './ManualMedicationFields'
import {
  EMPTY_MANUAL_MEDICATION,
  type ManualMedicationValue,
} from '../../utils/manual-medication'
import type { AddMedicationInput } from '../../types'

interface MedicationAddFormProps {
  onAdd: (input: AddMedicationInput) => void
  isAdding: boolean
}

export function MedicationAddForm({ onAdd, isAdding }: MedicationAddFormProps) {
  const { data: catalog = [] } = useMedications()

  const [manual, setManual] = useState(false)
  const [manualMedication, setManualMedication] =
    useState<ManualMedicationValue>(EMPTY_MANUAL_MEDICATION)
  const [medicationId, setMedicationId] = useState<number | null>(null)
  const [medicationLabel, setMedicationLabel] = useState('')
  const [dose, setDose] = useState('')
  const [frequency, setFrequency] = useState('')

  const options = catalog.filter((item) => item.active)

  // Tras añadir, el formulario (incluida la casilla) vuelve a su estado inicial.
  function reset() {
    setManual(false)
    setManualMedication(EMPTY_MANUAL_MEDICATION)
    setMedicationId(null)
    setMedicationLabel('')
    setDose('')
    setFrequency('')
  }

  // Medicamento del catálogo o uno nuevo; null si falta algún dato obligatorio.
  function selection(): Pick<AddMedicationInput, 'medicationId' | 'newMedication'> | null {
    if (!manual) {
      if (medicationId) return { medicationId }
      toast.error('Selecciona un medicamento del catálogo o marca "escribir manualmente".')
      return null
    }
    const name = manualMedication.name.trim()
    if (!name || !/\p{L}/u.test(name)) {
      toast.error('Indica el nombre del medicamento.')
      return null
    }
    if (manualMedication.presentationId === '') {
      toast.error('Elige la presentación del medicamento.')
      return null
    }
    return {
      newMedication: {
        name,
        presentationId: manualMedication.presentationId,
        concentration: manualMedication.concentration.trim() || undefined,
      },
    }
  }

  function submit() {
    const medication = selection()
    if (!medication) return
    onAdd({
      ...medication,
      dose: dose.trim() || undefined,
      frequency: frequency.trim() || undefined,
    })
    reset()
  }

  return (
    <Stack spacing={0.5} sx={{ mt: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {manual ? (
          <ManualMedicationFields value={manualMedication} onChange={setManualMedication} />
        ) : (
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
        )}
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
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={manual}
            onChange={(event) => {
              setManual(event.target.checked)
              setMedicationId(null)
              setMedicationLabel('')
              setManualMedication(EMPTY_MANUAL_MEDICATION)
            }}
          />
        }
        label="El medicamento no está en el catálogo · escribir manualmente"
        sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
      />
    </Stack>
  )
}

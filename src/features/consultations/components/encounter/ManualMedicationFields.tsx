import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useMedicationPresentations } from '@/features/catalogs'
import type { ManualMedicationValue } from '../../utils/manual-medication'

interface ManualMedicationFieldsProps {
  value: ManualMedicationValue
  onChange: (next: ManualMedicationValue) => void
}

// Campos para un medicamento que no está en el catálogo: nombre, presentación
// (obligatoria en el catálogo) y concentración opcional.
export function ManualMedicationFields({ value, onChange }: ManualMedicationFieldsProps) {
  const { data: presentations = [] } = useMedicationPresentations()

  return (
    <>
      <TextField
        size="small"
        placeholder="Nombre del medicamento…"
        value={value.name}
        onChange={(event) => onChange({ ...value, name: event.target.value })}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="manual-medication-presentation">Presentación</InputLabel>
        <Select<number | ''>
          labelId="manual-medication-presentation"
          label="Presentación"
          value={value.presentationId}
          onChange={(event) =>
            onChange({
              ...value,
              presentationId: event.target.value === '' ? '' : Number(event.target.value),
            })
          }
        >
          {presentations
            .filter((presentation) => presentation.active)
            .map((presentation) => (
              <MenuItem key={presentation.id} value={presentation.id}>
                {presentation.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        placeholder="Concentración"
        value={value.concentration}
        onChange={(event) => onChange({ ...value, concentration: event.target.value })}
        sx={{ width: { md: 130 } }}
      />
    </>
  )
}

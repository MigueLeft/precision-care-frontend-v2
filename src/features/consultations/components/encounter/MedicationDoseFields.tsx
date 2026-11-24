import { Stack, TextField } from '@mui/material'
import { MedicationFrequencyField } from '@/features/patient-medications'
import type { MedicationScheduleState } from '../../hooks/useMedicationSchedule'

type MedicationDoseFieldsProps = {
  schedule: MedicationScheduleState
}

// Esquema del medicamento en edición. Cada campo conserva un ancho
// mínimo y, si no caben en el mismo renglón, la frecuencia baja al siguiente
// (nunca queda encogida ni tapada por los botones de la fila).
export function MedicationDoseFields({
  schedule: { values, set },
}: MedicationDoseFieldsProps) {
  return (
    <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Dosis"
          value={values.dose}
          onChange={(event) => set({ dose: event.target.value })}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          sx={{ flex: '1 1 160px', minWidth: 140 }}
        />
        <MedicationFrequencyField
          value={values.frequency}
          onChange={(frequency) => set({ frequency })}
          sx={{ flex: '2 1 220px', minWidth: 180 }}
        />
      </Stack>
      <TextField size="small" label="Nota de frecuencia (opcional)" multiline minRows={2} value={values.frequencyNotes} onChange={(event) => set({ frequencyNotes: event.target.value })} slotProps={{ htmlInput: { maxLength: 500 } }} />
      <TextField size="small" label="Duración" placeholder="Ej. 7 días o uso continuo" value={values.duration} onChange={(event) => set({ duration: event.target.value })} />
    </Stack>
  )
}

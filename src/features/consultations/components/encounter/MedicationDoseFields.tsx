import { Stack, TextField } from '@mui/material'

type MedicationDoseFieldsProps = {
  dose: string
  frequency: string
  onDoseChange: (value: string) => void
  onFrequencyChange: (value: string) => void
}

// Dosis y frecuencia de un medicamento en edición. Cada campo conserva un ancho
// mínimo y, si no caben en el mismo renglón, la frecuencia baja al siguiente
// (nunca queda encogida ni tapada por los botones de la fila).
export function MedicationDoseFields({
  dose,
  frequency,
  onDoseChange,
  onFrequencyChange,
}: MedicationDoseFieldsProps) {
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="Dosis"
        value={dose}
        onChange={(event) => onDoseChange(event.target.value)}
        sx={{ flex: '1 1 160px', minWidth: 140 }}
      />
      <TextField
        size="small"
        label="Frecuencia"
        value={frequency}
        onChange={(event) => onFrequencyChange(event.target.value)}
        sx={{ flex: '2 1 220px', minWidth: 180 }}
      />
    </Stack>
  )
}

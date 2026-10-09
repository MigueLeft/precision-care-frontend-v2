import type { SxProps, Theme } from '@mui/material'
import { SelectWithOtherField } from '@/components/ui/SelectWithOtherField'
import { MEDICATION_FREQUENCIES } from '../utils/medication-frequencies'

type MedicationFrequencyFieldProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  sx?: SxProps<Theme>
}

// Frecuencia del medicamento: lista fija + "Otro" con escritura libre. Se usa
// igual en la consulta, el expediente y el formulario IM1.
export function MedicationFrequencyField({ label = 'Frecuencia', ...props }: MedicationFrequencyFieldProps) {
  return (
    <SelectWithOtherField
      label={label}
      options={MEDICATION_FREQUENCIES}
      otherLabel="Otro"
      otherPlaceholder="Ej. cada 48 horas"
      {...props}
    />
  )
}

import { Controller, type Control } from 'react-hook-form'
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import type { PatientFormValues } from '../schemas/patient-form.schema'
import { PATIENT_SEX_LABELS } from '../utils/patient-format'

type PatientSexFieldProps = {
  control: Control<PatientFormValues>
}

// Sexo biológico: define referencias clínicas (IM1, reportes) y la silueta
// del análisis de composición corporal.
export function PatientSexField({ control }: PatientSexFieldProps) {
  return (
    <Controller
      name="sex"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormLabel sx={{ fontSize: '12px' }}>Sexo</FormLabel>
          <RadioGroup row value={field.value} onChange={(event) => field.onChange(event.target.value)}>
            {(['female', 'male'] as const).map((value) => (
              <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={PATIENT_SEX_LABELS[value]} />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import { TimeField12h } from '@/components/ui/TimeField12h'
import { DURATION_MIN, DURATION_STEP_MIN } from '../schemas/appointment-form.schema'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'

type AppointmentScheduleFieldsProps = {
  control: Control<AppointmentFormValues>
}

const todayIso = new Date().toLocaleDateString('en-CA')

// Fecha y duración en una fila; la hora (hora, minutos y a. m./p. m.) ocupa la
// suya propia para que sus tres selectores no queden apretados.
export function AppointmentScheduleFields({ control }: AppointmentScheduleFieldsProps) {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="date"
              label="Fecha"
              error={!!error}
              helperText={error?.message}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayIso } }}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="durationMin"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              type="number"
              label="Duración (min)"
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
              }
              onBlur={field.onBlur}
              error={!!error}
              helperText={error?.message ?? `En pasos de ${DURATION_STEP_MIN} min`}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: DURATION_MIN, step: DURATION_STEP_MIN },
              }}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TimeField12h
              label="Hora"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </>
  )
}

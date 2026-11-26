import { Controller, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import { usePatients, formatPatientName } from '@/features/patients'
import { AppointmentSpecialistField } from './AppointmentSpecialistField'
import { AppointmentAdditionalFields } from './AppointmentAdditionalFields'
import { appointmentTypeOptions } from '../schemas/appointment-form.schema'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from '../utils/appointment-helpers'
import type { AppointmentModality } from '../types'
import { AppointmentScheduleFields } from './AppointmentScheduleFields'

interface AppointmentFormFieldsProps {
  control: Control<AppointmentFormValues>
  lockPatient?: boolean
  priceLocked?: boolean
  setValue: UseFormSetValue<AppointmentFormValues>
}

const MODALITIES: AppointmentModality[] = ['in_person', 'telemedicine']

export function AppointmentFormFields({ control, lockPatient, setValue, priceLocked }: AppointmentFormFieldsProps) {
  const { data: patients = [] } = usePatients()
  const modality = useWatch({ control, name: 'modality' })
  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="patientId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SearchableSelect
              label="Paciente"
              placeholder="Buscar paciente por nombre o MRN…"
              disabled={lockPatient}
              options={patients.map((patient) => ({
                id: patient.id,
                label: `${formatPatientName(patient)} · ${patient.mrn}`,
              }))}
              value={field.value || undefined}
              onChange={(id) => field.onChange(id ?? 0)}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <AppointmentSpecialistField control={control} setValue={setValue} priceLocked={priceLocked} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="modality"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="appt-form-modality">Modalidad</InputLabel>
              <Select labelId="appt-form-modality" label="Modalidad" {...field}>
                {MODALITIES.map((m) => (
                  <MenuItem key={m} value={m}>
                    {APPOINTMENT_MODALITY_LABELS[m]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="appt-form-type">Tipo de cita</InputLabel>
              <Select labelId="appt-form-type" label="Tipo de cita" {...field}>
                {appointmentTypeOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {APPOINTMENT_TYPE_LABELS[t]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      {modality === 'telemedicine' ? (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="telemedicineLink"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Enlace de telemedicina"
                error={!!error}
                helperText={error?.message}
                fullWidth
              />
            )}
          />
        </Grid>
      ) : (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField {...field} value={field.value ?? ''} label="Ubicación" fullWidth />
            )}
          />
        </Grid>
      )}

      <AppointmentScheduleFields control={control} />

      <AppointmentAdditionalFields control={control} />
    </Grid>
  )
}

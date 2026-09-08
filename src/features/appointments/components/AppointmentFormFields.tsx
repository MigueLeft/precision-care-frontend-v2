import { Controller, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import { usePatients, formatPatientName } from '@/features/patients'
import { useSpecialistsLookup } from '@/features/identity'
import {
  appointmentTypeOptions,
  durationOptions,
} from '../schemas/appointment-form.schema'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from '../utils/appointment-helpers'
import type { AppointmentModality } from '../types'

interface AppointmentFormFieldsProps {
  control: Control<AppointmentFormValues>
  lockPatient?: boolean
}

const MODALITIES: AppointmentModality[] = ['in_person', 'telemedicine']

export function AppointmentFormFields({ control, lockPatient }: AppointmentFormFieldsProps) {
  const { data: patients = [] } = usePatients()
  const { data: specialists = [] } = useSpecialistsLookup()
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
        <Controller
          name="specialistId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel id="appt-form-specialist">Especialista</InputLabel>
              <Select
                labelId="appt-form-specialist"
                label="Especialista"
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {specialists.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} {s.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
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

      <Grid size={{ xs: 12, sm: 4 }}>
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
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="time"
              label="Hora"
              error={!!error}
              helperText={error?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Controller
          name="durationMin"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="appt-form-duration">Duración</InputLabel>
              <Select
                labelId="appt-form-duration"
                label="Duración"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {durationOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d} min
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              label="Motivo de consulta"
              placeholder="Motivo o tipo de cita…"
              multiline
              minRows={2}
              fullWidth
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 0.5 }}>
          Recordatorios
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Controller
            name="remindEmail"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox checked={field.value} onChange={field.onChange} />}
                label="Email"
              />
            )}
          />
          <FormControlLabel
            control={<Checkbox checked disabled />}
            label="WhatsApp"
          />
        </Stack>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
          Los recordatorios automáticos y WhatsApp aún no están integrados. El envío por email es
          manual desde el detalle de la cita.
        </Typography>
      </Grid>
    </Grid>
  )
}

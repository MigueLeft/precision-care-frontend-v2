import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { usePatients, formatPatientName } from '@/features/patients'
import { useSpecialistsLookup } from '../hooks/useSpecialistsLookup'
import { userTypeOptions } from '../schemas/user-form.schema'
import type { UserFormValues } from '../schemas/user-form.schema'

const TYPE_LABELS: Record<(typeof userTypeOptions)[number], string> = {
  patient: 'Paciente',
  specialist: 'Especialista',
  administrative: 'Administrativo',
}

interface UserFormFieldsProps {
  control: Control<UserFormValues>
  mode: 'create' | 'edit'
  type: UserFormValues['type']
}

export function UserFormFields({ control, mode, type }: UserFormFieldsProps) {
  const { data: patients = [] } = usePatients()
  const { data: specialists = [] } = useSpecialistsLookup()

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="email"
              label="Correo electrónico"
              fullWidth
              disabled={mode === 'edit'}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      {mode === 'create' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="password"
                label="Contraseña"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Nombre" fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Apellido" fullWidth error={!!error} helperText={error?.message} />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth disabled={mode === 'edit'}>
              <InputLabel id="user-type-label">Tipo de usuario</InputLabel>
              <Select labelId="user-type-label" label="Tipo de usuario" {...field}>
                {userTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {TYPE_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      {type === 'patient' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="user-patient-label">Paciente</InputLabel>
                <Select<number | ''>
                  labelId="user-patient-label"
                  label="Paciente"
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                  }
                >
                  <MenuItem value="">Sin especificar</MenuItem>
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {formatPatientName(patient)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      )}
      {type === 'specialist' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="specialistId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="user-specialist-label">Especialista</InputLabel>
                <Select<number | ''>
                  labelId="user-specialist-label"
                  label="Especialista"
                  value={field.value ?? ''}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
                  }
                >
                  <MenuItem value="">Sin especificar</MenuItem>
                  {specialists.map((specialist) => (
                    <MenuItem key={specialist.id} value={specialist.id}>
                      {specialist.name} {specialist.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      )}
    </Grid>
  )
}

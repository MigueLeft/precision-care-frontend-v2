import { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, UseFormSetError, UseFormClearErrors } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { usePatients, formatPatientName } from '@/features/patients'
import { useSpecialistsLookup } from '../hooks/useSpecialistsLookup'
import { checkEmailExists } from '../services/users.service'
import { userTypeOptions } from '../schemas/user-form.schema'
import type { UserFormValues } from '../schemas/user-form.schema'

const TYPE_LABELS: Record<(typeof userTypeOptions)[number], string> = {
  patient: 'Paciente',
  specialist: 'Especialista',
  administrative: 'Administrativo',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface UserFormFieldsProps {
  control: Control<UserFormValues>
  mode: 'create' | 'edit'
  type: UserFormValues['type']
  setError: UseFormSetError<UserFormValues>
  clearErrors: UseFormClearErrors<UserFormValues>
}

export function UserFormFields({ control, mode, type, setError, clearErrors }: UserFormFieldsProps) {
  const { data: patients = [] } = usePatients()
  const { data: specialists = [] } = useSpecialistsLookup()
  const [showPassword, setShowPassword] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const checkSeq = useRef(0)

  async function handleEmailBlur(email: string) {
    if (mode !== 'create' || !EMAIL_REGEX.test(email)) return

    const seq = ++checkSeq.current
    setIsCheckingEmail(true)
    try {
      const exists = await checkEmailExists(email)
      if (seq !== checkSeq.current) return
      if (exists) {
        setError('email', { type: 'manual', message: 'Ya existe un usuario registrado con este correo.' })
      } else {
        clearErrors('email')
      }
    } finally {
      if (seq === checkSeq.current) setIsCheckingEmail(false)
    }
  }

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
              helperText={error?.message ?? (isCheckingEmail ? 'Verificando disponibilidad…' : undefined)}
              onBlur={(event) => {
                field.onBlur()
                void handleEmailBlur(event.target.value)
              }}
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
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 18 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
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

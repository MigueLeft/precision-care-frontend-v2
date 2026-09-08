import { Controller, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material'
import { useRoles } from '@/features/identity'
import type { SpecialistFormValues } from '../schemas/specialist-form.schema'

interface Props {
  control: Control<SpecialistFormValues>
}

export function SpecialistAccessFields({ control }: Props) {
  const createUser = useWatch({ control, name: 'createUser' })
  const { data: roles = [] } = useRoles()

  return (
    <Box>
      <Controller
        name="createUser"
        control={control}
        render={({ field }) => (
          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: field.value ? 'primary.main' : 'divider',
              bgcolor: field.value ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
            })}
          >
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Crear usuario para este especialista"
            />
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', ml: 4 }}>
              Sin usuario, el especialista existe solo como registro: se le pueden asignar pacientes y
              citas, pero no puede iniciar sesión.
            </Typography>
          </Box>
        )}
      />

      {createUser && (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="roleId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="specialist-role-label">Rol</InputLabel>
                  <Select<number | ''>
                    labelId="specialist-role-label"
                    label="Rol"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography sx={{ fontSize: '11px', color: error ? 'error.main' : 'text.secondary', mt: 0.5 }}>
                    {error?.message ?? 'Define sus permisos. Se gestionan en Usuarios y roles.'}
                  </Typography>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="initialStatus"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="specialist-status-label">Estado inicial</InputLabel>
                  <Select {...field} labelId="specialist-status-label" label="Estado inicial">
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="passwordMode"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel sx={{ fontSize: '13px' }}>Cómo se define la contraseña</FormLabel>
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="invite"
                      control={<Radio />}
                      label="Enviar invitación por correo (recomendado)"
                    />
                    <FormControlLabel
                      value="temporary"
                      control={<Radio />}
                      label="Asignar contraseña temporal"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

import { Controller } from 'react-hook-form'
import type { Control, FieldPath } from 'react-hook-form'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { PatientFormValues } from '../schemas/patient-form.schema'
import type { Country } from '@/features/catalogs'

interface PatientFormFieldsProps {
  control: Control<PatientFormValues>
  countries: Country[]
}

interface CountrySelectFieldProps {
  name: FieldPath<PatientFormValues>
  label: string
  control: Control<PatientFormValues>
  countries: Country[]
}

function CountrySelectField({ name, label, control, countries }: CountrySelectFieldProps) {
  const labelId = `${name}-label`
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select
            labelId={labelId}
            label={label}
            value={field.value ?? ''}
            onChange={(event) =>
              field.onChange(event.target.value === '' ? undefined : Number(event.target.value))
            }
          >
            <MenuItem value="">Sin especificar</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

export function PatientFormFields({ control, countries }: PatientFormFieldsProps) {
  return (
    <Grid container spacing={2} sx={{ mt: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Primer nombre"
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="middleName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Segundo nombre"
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Primer apellido"
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="secondLastName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Segundo apellido"
              error={!!error}
              helperText={error?.message}
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="date"
              label="Fecha de nacimiento"
              error={!!error}
              helperText={error?.message}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              type="email"
              label="Correo electrónico"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelectField
          name="nationalityCountryId"
          label="Nacionalidad"
          control={control}
          countries={countries}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <CountrySelectField
          name="residenceCountryId"
          label="País de residencia"
          control={control}
          countries={countries}
        />
      </Grid>
    </Grid>
  )
}

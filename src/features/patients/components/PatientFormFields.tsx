import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import type { PatientFormValues } from '../schemas/patient-form.schema'
import type { Country } from '@/features/catalogs'

interface PatientFormFieldsProps {
  control: Control<PatientFormValues>
  countries: Country[]
}

export function PatientFormFields({ control, countries }: PatientFormFieldsProps) {
  const countryOptions = countries.map((country) => ({ id: country.id, label: country.name }))

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
        <Controller
          name="nationalityCountryId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SearchableSelect
              label="Nacionalidad"
              options={countryOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="residenceCountryId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <SearchableSelect
              label="País de residencia"
              options={countryOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}

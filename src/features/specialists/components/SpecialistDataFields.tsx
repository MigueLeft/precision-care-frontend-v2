import { Controller, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, TextField } from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import { SearchableMultiSelect } from '@/components/SearchableMultiSelect'
import { useCountries, useStates, useCities, useMedicalSpecialties } from '@/features/catalogs'
import type { SpecialistFormValues } from '../schemas/specialist-form.schema'

interface Props {
  control: Control<SpecialistFormValues>
  setValue: UseFormSetValue<SpecialistFormValues>
}

type TextName = 'name' | 'lastName' | 'email' | 'phone' | 'practiceAddress'

export function SpecialistDataFields({ control, setValue }: Props) {
  const residenceCountryId = useWatch({ control, name: 'residenceCountryId' })
  const stateId = useWatch({ control, name: 'stateId' })
  const primarySpecialtyId = useWatch({ control, name: 'primarySpecialtyId' })

  const { data: countries = [] } = useCountries()
  const { data: states = [] } = useStates(residenceCountryId || undefined)
  const { data: cities = [] } = useCities(stateId || undefined)
  const { data: specialties = [] } = useMedicalSpecialties()

  const countryOptions = countries.map((c) => ({ id: c.id, label: c.name }))
  const specialtyOptions = specialties.map((s) => ({ id: s.id, label: s.name }))

  const text = (name: TextName, label: string, helper?: string, required?: boolean) => (
    <Grid size={{ xs: 12, sm: name === 'practiceAddress' ? 12 : 6 }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={label}
            required={required}
            fullWidth
            error={!!error}
            helperText={error?.message ?? helper}
          />
        )}
      />
    </Grid>
  )

  const select = (
    name: 'nationalityCountryId' | 'residenceCountryId' | 'primarySpecialtyId',
    label: string,
    options: { id: number; label: string }[],
    helper?: string,
    onPicked?: () => void,
  ) => (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <SearchableSelect
            label={label}
            required
            options={options}
            value={field.value}
            onChange={(id) => {
              field.onChange(id ?? 0)
              onPicked?.()
            }}
            error={!!error}
            helperText={error?.message ?? helper}
          />
        )}
      />
    </Grid>
  )

  return (
    <Grid container spacing={2}>
      {text('name', 'Nombre', undefined, true)}
      {text('lastName', 'Apellido', undefined, true)}
      {text(
        'email',
        'Correo',
        'Se usa como identificador y, si se crea usuario, como acceso al sistema.',
        true,
      )}
      {text('phone', 'Teléfono (opcional)')}

      {select('nationalityCountryId', 'Nacionalidad', countryOptions)}
      {select('residenceCountryId', 'País de residencia', countryOptions, undefined, () => {
        setValue('stateId', undefined)
        setValue('cityId', undefined)
      })}

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="stateId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Estado / provincia (opcional)"
              options={states.map((s) => ({ id: s.id, label: s.name }))}
              value={field.value}
              onChange={(id) => {
                field.onChange(id)
                setValue('cityId', undefined)
              }}
              disabled={!residenceCountryId}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="cityId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Ciudad (opcional)"
              options={cities.map((c) => ({ id: c.id, label: c.name }))}
              value={field.value}
              onChange={field.onChange}
              disabled={!stateId}
            />
          )}
        />
      </Grid>

      {select(
        'primarySpecialtyId',
        'Especialidad',
        specialtyOptions,
        'Especialidad principal; determina las plantillas de consulta por defecto.',
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="otherSpecialtyIds"
          control={control}
          render={({ field }) => (
            <SearchableMultiSelect
              label="Otras especialidades (opcional)"
              options={specialtyOptions.filter((o) => o.id !== primarySpecialtyId)}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Grid>

      {text(
        'practiceAddress',
        'Dirección física donde atiende (opcional)',
        'Aparece en recetas y entregables impresos. Puede definirse después.',
      )}
    </Grid>
  )
}

import { Controller } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import {
  Grid,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useAntecedentPersonalCatalog } from '@/features/catalogs'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'
import { ANTECEDENT_STATUS_LABELS } from '../utils/antecedent-format'
import type { AntecedentStatus } from '../types'

const STATUS_OPTIONS: AntecedentStatus[] = [
  'active',
  'in_follow_up',
  'resolved',
  'inactive',
]

interface PersonalAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "personal": condición (buscada en
// antecedent_personal_catalog), fecha de inicio, estado clínico y CIE-10.
export function PersonalAntecedentFields({ control, setValue }: PersonalAntecedentFieldsProps) {
  const { data: personalCatalog = [] } = useAntecedentPersonalCatalog()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <CatalogSearchInput
                options={personalCatalog}
                placeholder="Buscar antecedente personal…"
                onAdd={(name, catalogId) => {
                  field.onChange(name)
                  setValue('personalCatalogId', catalogId)
                }}
                manualLabel="No está en el catálogo · escribir manualmente"
              />
              {field.value ? (
                <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.5 }}>
                  Seleccionado: {field.value}
                </Typography>
              ) : null}
              {error ? <FormHelperText error>{error.message}</FormHelperText> : null}
            </>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="eventDate" label="Desde" type="date" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="antecedent-status-label">Estado</InputLabel>
              <Select
                labelId="antecedent-status-label"
                label="Estado"
                value={field.value ?? ''}
                onChange={(event) => {
                  const value = event.target.value as string
                  field.onChange(value ? (value as AntecedentStatus) : undefined)
                }}
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {ANTECEDENT_STATUS_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="cie10Code" label="CIE-10" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
          Los antecedentes personales aparecen en la tabla con su estado.
        </Typography>
      </Grid>
    </>
  )
}

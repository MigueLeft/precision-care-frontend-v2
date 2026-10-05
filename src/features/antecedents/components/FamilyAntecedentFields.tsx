import { Controller } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, Typography, FormHelperText } from '@mui/material'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useAntecedentDiseaseOptions } from '../hooks/useAntecedentDiseaseOptions'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'

interface FamilyAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "family": condición (buscada en el
// catálogo de enfermedades, con opción de escribir manualmente) y parentesco.
export function FamilyAntecedentFields({ control, setValue }: FamilyAntecedentFieldsProps) {
  const diseaseOptions = useAntecedentDiseaseOptions()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <CatalogSearchInput
                options={diseaseOptions}
                placeholder="Buscar antecedente familiar…"
                onAdd={(name, catalogId) => {
                  field.onChange(name)
                  setValue('diseaseCatalogId', catalogId)
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
        <FormText control={control} name="relationship" label="Parentesco" />
      </Grid>
    </>
  )
}

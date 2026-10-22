import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid } from '@mui/material'
import { useAntecedentDiseaseOptions } from '../hooks/useAntecedentDiseaseOptions'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'
import { AntecedentCatalogField } from './AntecedentCatalogField'

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
        <AntecedentCatalogField
          control={control}
          setValue={setValue}
          name="name"
          idName="diseaseCatalogId"
          options={diseaseOptions}
          label="Condición"
          placeholder="Buscar antecedente familiar…"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="relationship" label="Parentesco" />
      </Grid>
    </>
  )
}

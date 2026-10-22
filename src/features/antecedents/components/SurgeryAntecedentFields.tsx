import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid } from '@mui/material'
import { useSurgeryCatalog } from '@/features/catalogs'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'
import { AntecedentCatalogField } from './AntecedentCatalogField'

interface SurgeryAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "surgery", los mismos de la captura
// en consulta: procedimiento (surgery_catalog, también es el nombre del
// antecedente), fecha y complicaciones.
export function SurgeryAntecedentFields({ control, setValue }: SurgeryAntecedentFieldsProps) {
  const { data: surgeryCatalog = [] } = useSurgeryCatalog()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <AntecedentCatalogField
          control={control}
          setValue={setValue}
          name="surgeryProcedure"
          idName="surgeryProcedureCatalogId"
          options={surgeryCatalog}
          label="Procedimiento"
          placeholder="Buscar procedimiento…"
          syncName
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="eventDate" label="Fecha" type="date" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="cie10Code" label="CIE-10" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormText control={control} name="surgeryComplications" label="Complicaciones" />
      </Grid>
    </>
  )
}

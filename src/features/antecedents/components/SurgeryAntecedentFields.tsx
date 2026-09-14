import { Controller } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, Typography, FormHelperText } from '@mui/material'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useSurgeryCatalog } from '@/features/catalogs'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'

interface SurgeryAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "surgery": nombre/condición libre,
// procedimiento (buscado en surgery_catalog), institución y demás detalles.
export function SurgeryAntecedentFields({ control, setValue }: SurgeryAntecedentFieldsProps) {
  const { data: surgeryCatalog = [] } = useSurgeryCatalog()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="name" label="Condición / nombre" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="surgeryProcedure"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <CatalogSearchInput
                options={surgeryCatalog}
                placeholder="Buscar procedimiento…"
                onAdd={(name, catalogId) => {
                  field.onChange(name)
                  setValue('surgeryProcedureCatalogId', catalogId)
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
        <FormText control={control} name="surgeryInstitution" label="Institución" />
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText
          control={control}
          name="surgeryTreatingPhysician"
          label="Médico tratante"
        />
      </Grid>
    </>
  )
}

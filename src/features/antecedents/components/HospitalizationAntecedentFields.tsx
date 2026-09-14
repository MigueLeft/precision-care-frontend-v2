import { Controller } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, Typography, FormHelperText } from '@mui/material'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useHospitalizationCatalog } from '@/features/catalogs'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'

interface HospitalizationAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "hospitalization": nombre/condición
// libre, fechas de ingreso/egreso, institución, CIE-10 al egreso y motivo
// (buscado en hospitalization_catalog).
export function HospitalizationAntecedentFields({
  control,
  setValue,
}: HospitalizationAntecedentFieldsProps) {
  const { data: hospitalizationCatalog = [] } = useHospitalizationCatalog()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="name" label="Condición / nombre" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText
          control={control}
          name="hospitalizationAdmissionDate"
          label="Ingreso"
          type="date"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText
          control={control}
          name="hospitalizationDischargeDate"
          label="Egreso"
          type="date"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="hospitalizationInstitution" label="Institución" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText
          control={control}
          name="hospitalizationDischargeDiagnosisCie10"
          label="CIE-10 al egreso"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="hospitalizationReason"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <CatalogSearchInput
                options={hospitalizationCatalog}
                placeholder="Buscar motivo de hospitalización…"
                onAdd={(name, catalogId) => {
                  field.onChange(name)
                  setValue('hospitalizationReasonCatalogId', catalogId)
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
    </>
  )
}

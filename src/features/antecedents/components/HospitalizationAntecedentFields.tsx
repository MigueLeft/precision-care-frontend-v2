import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid } from '@mui/material'
import { useHospitalizationCatalog } from '@/features/catalogs'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { FormText } from './AntecedentTextField'
import { AntecedentCatalogField } from './AntecedentCatalogField'

interface HospitalizationAntecedentFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
}

// Campos específicos de antecedentes tipo "hospitalization": motivo (buscado en
// hospitalization_catalog, también es el nombre del antecedente), fechas de
// ingreso/egreso, CIE-10 al egreso y complicaciones.
export function HospitalizationAntecedentFields({
  control,
  setValue,
}: HospitalizationAntecedentFieldsProps) {
  const { data: hospitalizationCatalog = [] } = useHospitalizationCatalog()

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <AntecedentCatalogField
          control={control}
          setValue={setValue}
          name="hospitalizationReason"
          idName="hospitalizationReasonCatalogId"
          options={hospitalizationCatalog}
          label="Motivo"
          placeholder="Buscar motivo de hospitalización…"
          syncName
        />
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
        <FormText
          control={control}
          name="hospitalizationDischargeDiagnosisCie10"
          label="CIE-10 al egreso"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormText
          control={control}
          name="hospitalizationComplications"
          label="Complicaciones"
        />
      </Grid>
    </>
  )
}

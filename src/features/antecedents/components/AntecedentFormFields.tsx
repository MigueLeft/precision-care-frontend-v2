import { Controller, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { ANTECEDENT_TYPE_LABELS } from '../utils/antecedent-format'
import type { AntecedentType } from '../types'
import { FormText } from './AntecedentTextField'
import { FamilyAntecedentFields } from './FamilyAntecedentFields'
import { PersonalAntecedentFields } from './PersonalAntecedentFields'
import { SurgeryAntecedentFields } from './SurgeryAntecedentFields'
import { HospitalizationAntecedentFields } from './HospitalizationAntecedentFields'

const TYPE_OPTIONS: AntecedentType[] = [
  'personal',
  'family',
  'surgery',
  'hospitalization',
  'other',
]

interface AntecedentFormFieldsProps {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
  lockType?: boolean
}

// Formulario de antecedente: el tipo decide qué subcomponente de campos
// específicos se renderiza (family/personal/surgery/hospitalization); "other"
// no tiene catálogo propio, así que usa un campo de nombre libre.
export function AntecedentFormFields({ control, setValue, lockType }: AntecedentFormFieldsProps) {
  const type = useWatch({ control, name: 'type' })

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth disabled={lockType}>
              <InputLabel id="antecedent-type-label">Tipo</InputLabel>
              <Select
                {...field}
                labelId="antecedent-type-label"
                label="Tipo"
                onChange={(event) => {
                  field.onChange(event)
                  // Los ids de catálogo son específicos de cada tipo; al
                  // cambiar de tipo dejan de ser válidos.
                  setValue('familyCatalogId', undefined)
                  setValue('personalCatalogId', undefined)
                  setValue('surgeryProcedureCatalogId', undefined)
                  setValue('hospitalizationReasonCatalogId', undefined)
                }}
              >
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {ANTECEDENT_TYPE_LABELS[option]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {type === 'other' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormText control={control} name="name" label="Condición / nombre" />
        </Grid>
      )}

      {type === 'family' && <FamilyAntecedentFields control={control} setValue={setValue} />}
      {type === 'personal' && <PersonalAntecedentFields control={control} setValue={setValue} />}
      {type === 'surgery' && <SurgeryAntecedentFields control={control} setValue={setValue} />}
      {type === 'hospitalization' && (
        <HospitalizationAntecedentFields control={control} setValue={setValue} />
      )}

      {(type === 'family' || type === 'other') && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormText control={control} name="eventDate" label="Fecha" type="date" />
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
        <FormText control={control} name="description" label="Notas" multiline />
      </Grid>
    </Grid>
  )
}

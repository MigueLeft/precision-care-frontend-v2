import { Controller, useWatch } from 'react-hook-form'
import type { Control, FieldPath } from 'react-hook-form'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { ANTECEDENT_STATUS_LABELS, ANTECEDENT_TYPE_LABELS } from '../utils/antecedent-format'
import type { AntecedentStatus, AntecedentType } from '../types'

type Name = FieldPath<AntecedentFormValues>

interface FieldProps {
  control: Control<AntecedentFormValues>
  name: Name
  label: string
  type?: 'text' | 'date'
  multiline?: boolean
}

function FormText({ control, name, label, type = 'text', multiline }: FieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          type={type}
          label={label}
          multiline={multiline}
          minRows={multiline ? 2 : undefined}
          error={!!error}
          helperText={error?.message}
          slotProps={type === 'date' ? { inputLabel: { shrink: true } } : undefined}
        />
      )}
    />
  )
}

const TYPE_OPTIONS: AntecedentType[] = [
  'personal',
  'family',
  'surgery',
  'hospitalization',
  'other',
]
const STATUS_OPTIONS: AntecedentStatus[] = [
  'active',
  'in_follow_up',
  'resolved',
  'inactive',
]

interface AntecedentFormFieldsProps {
  control: Control<AntecedentFormValues>
  lockType?: boolean
}

export function AntecedentFormFields({ control, lockType }: AntecedentFormFieldsProps) {
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
              <Select {...field} labelId="antecedent-type-label" label="Tipo">
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormText control={control} name="name" label="Condición / nombre" />
      </Grid>

      {type === 'family' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormText control={control} name="relationship" label="Parentesco" />
        </Grid>
      )}

      {type === 'personal' && (
        <>
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
        </>
      )}

      {type === 'surgery' && (
        <>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormText control={control} name="surgeryProcedure" label="Procedimiento" />
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
      )}

      {type === 'hospitalization' && (
        <>
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
              name="hospitalizationInstitution"
              label="Institución"
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
            <FormText control={control} name="hospitalizationReason" label="Motivo" />
          </Grid>
        </>
      )}

      {(type === 'family' || type === 'other') && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormText control={control} name="eventDate" label="Fecha" type="date" />
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
        <FormText control={control} name="description" label="Notas" multiline />
      </Grid>

      {type === 'personal' && (
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            Los antecedentes personales patológicos aparecen en la tabla con su estado.
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

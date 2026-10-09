import { Controller } from 'react-hook-form'
import type { Control, FieldPath } from 'react-hook-form'
import { TextField } from '@mui/material'
import { PartialDateField } from '@/components/ui/PartialDateField'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'

export type AntecedentFieldName = FieldPath<AntecedentFormValues>

export interface AntecedentFieldProps {
  control: Control<AntecedentFormValues>
  name: AntecedentFieldName
  label: string
  // 'date' = fecha parcial (mes y año, día opcional).
  type?: 'text' | 'date'
  multiline?: boolean
}

// Campo de texto controlado reutilizado por el formulario de antecedentes y
// sus subcomponentes por tipo (family/personal/surgery/hospitalization).
export function FormText({
  control,
  name,
  label,
  type = 'text',
  multiline,
}: AntecedentFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        type === 'date' ? (
          <PartialDateField
            label={label}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
            error={!!error}
            helperText={error?.message}
          />
        ) : (
          <TextField
            {...field}
            value={field.value ?? ''}
            label={label}
            multiline={multiline}
            minRows={multiline ? 2 : undefined}
            error={!!error}
            helperText={error?.message}
          />
        )
      }
    />
  )
}

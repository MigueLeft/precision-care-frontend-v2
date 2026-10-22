import { Controller, useFormState, useWatch } from 'react-hook-form'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { FormHelperText } from '@mui/material'
import { CatalogPicker } from '@/components/ui/CatalogPicker'
import type { CatalogOption } from '@/components/ui/CatalogSearchInput'
import type { AntecedentFormValues } from '../schemas/antecedent-form.schema'

type AntecedentCatalogFieldProps = {
  control: Control<AntecedentFormValues>
  setValue: UseFormSetValue<AntecedentFormValues>
  /** Campo de texto con el nombre elegido. */
  name: 'name' | 'surgeryProcedure' | 'hospitalizationReason'
  /** Campo con el id de catálogo de ese nombre. */
  idName: 'diseaseCatalogId' | 'surgeryProcedureCatalogId' | 'hospitalizationReasonCatalogId'
  options: CatalogOption[]
  label: string
  placeholder: string
  /** Copia también el nombre al nombre del antecedente (cirugía/hospitalización). */
  syncName?: boolean
}

// Selector de catálogo del formulario de antecedentes: muestra el valor ya
// guardado en el propio campo (al editar) y mantiene el id de catálogo.
export function AntecedentCatalogField({
  control,
  setValue,
  name,
  idName,
  options,
  label,
  placeholder,
  syncName,
}: AntecedentCatalogFieldProps) {
  const catalogId = useWatch({ control, name: idName })
  // Con syncName el nombre del antecedente no tiene campo propio: su error se ve aquí.
  const { errors } = useFormState({ control, name: 'name' })
  const nameError = syncName ? errors.name : undefined

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error ?? nameError
        return (
        <>
          <CatalogPicker
            options={options}
            label={label}
            placeholder={placeholder}
            value={field.value ? { name: field.value, catalogId } : null}
            onChange={(pick) => {
              field.onChange(pick?.name ?? '')
              setValue(idName, pick?.catalogId)
              if (syncName) setValue('name', pick?.name ?? '', { shouldValidate: true })
            }}
          />
          {error ? <FormHelperText error>{error.message}</FormHelperText> : null}
        </>
        )
      }}
    />
  )
}

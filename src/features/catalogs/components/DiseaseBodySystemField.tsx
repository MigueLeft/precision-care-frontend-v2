import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useBodySystems } from '../hooks/useBodySystems'
import type { DiseaseFormValues } from '../schemas/disease-form.schema'

type DiseaseBodySystemFieldProps = {
  control: Control<DiseaseFormValues>
}

// Aparato/sistema preestablecido de la enfermedad (opcional).
export function DiseaseBodySystemField({ control }: DiseaseBodySystemFieldProps) {
  const { data: bodySystems = [] } = useBodySystems()

  return (
    <Controller
      name="bodySystemId"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id="disease-body-system">Aparato / sistema</InputLabel>
          <Select<number | ''>
            labelId="disease-body-system"
            label="Aparato / sistema"
            value={field.value ?? ''}
            onChange={(event) =>
              field.onChange(event.target.value === '' ? null : Number(event.target.value))
            }
          >
            <MenuItem value="">Sin asignar</MenuItem>
            {bodySystems.map((system) => (
              <MenuItem key={system.id} value={system.id}>
                {system.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  )
}

import { Controller, type Control } from 'react-hook-form'
import { SearchableSelect } from '@/components/SearchableSelect'
import { useRaces } from '@/features/catalogs'
import type { PatientFormValues } from '../schemas/patient-form.schema'

type PatientRaceFieldProps = {
  control: Control<PatientFormValues>
}

// Raza (catálogo con los grupos del IM1). Al aterrizar el IM1 en la primera
// consulta se carga sola si la ficha no la tiene. La usa la PCE (Goff 2013).
export function PatientRaceField({ control }: PatientRaceFieldProps) {
  const { data: races = [] } = useRaces()

  return (
    <Controller
      name="raceId"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SearchableSelect
          label="Raza"
          options={races
            .filter((race) => race.active || race.id === field.value)
            .map((race) => ({ id: race.id, label: race.name }))}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  )
}

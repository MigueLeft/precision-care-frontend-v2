import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useSpecialistsLookup } from '@/features/identity'
import type { AppointmentFormValues } from '../schemas/appointment-form.schema'

type Props = { control: Control<AppointmentFormValues>; setValue: UseFormSetValue<AppointmentFormValues>; priceLocked?: boolean }
export function AppointmentSpecialistField({ control, setValue, priceLocked }: Props) {
  const query = useSpecialistsLookup()
  const selected = useWatch({ control, name: 'specialistId' })
  const specialists = query.data?.filter((s) => s.active || s.id === selected) ?? []
  return <Controller name="specialistId" control={control} render={({ field, fieldState }) => (
    <FormControl fullWidth error={!!fieldState.error || query.isError}>
      <InputLabel id="appt-form-specialist">Especialista</InputLabel>
      <Select labelId="appt-form-specialist" label="Especialista" value={field.value || ''} disabled={query.isLoading}
        onChange={(e) => {
          const id = Number(e.target.value)
          field.onChange(id)
          if (!priceLocked) setValue('basePrice', specialists.find((s) => s.id === id)?.defaultAppointmentPrice ?? null, { shouldDirty: true, shouldValidate: true })
        }}>
        {specialists.map((s) => <MenuItem key={s.id} value={s.id}>{s.name} {s.lastName}{s.active ? '' : ' (inactivo)'}</MenuItem>)}
      </Select>
      {(fieldState.error || query.isError) && <FormHelperText>{fieldState.error?.message ?? 'No se pudieron cargar los especialistas.'}</FormHelperText>}
    </FormControl>
  )} />
}

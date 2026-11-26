import { Controller, useWatch, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Stack, TextField, Typography } from '@mui/material'

type Props<T extends FieldValues> = { control: Control<T>; disabled?: boolean }

// Los formularios que lo usan incluyen basePrice y discountPercent.
export function PricingFields<T extends FieldValues>({ control, disabled }: Props<T>) {
  const price = useWatch({ control, name: 'basePrice' as Path<T> })
  const discount = useWatch({ control, name: 'discountPercent' as Path<T> })
  const total = price == null || price === '' ? null
    : Math.round(Math.round(Number(price) * 100) * (10000 - Math.round(Number(discount) * 100)) / 10000) / 100
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Controller name={'basePrice' as Path<T>} control={control} render={({ field, fieldState }) => (
          <TextField {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            label="Precio de la cita" type="number" fullWidth disabled={disabled}
            error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Importe antes del descuento.'}
            slotProps={{ htmlInput: { min: 0, max: 99999999.99, step: 0.01 } }} />
        )} />
        <Controller name={'discountPercent' as Path<T>} control={control} render={({ field, fieldState }) => (
          <TextField {...field} onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            label="Descuento (%)" type="number" fullWidth disabled={disabled}
            error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Entre 0 y 100 %.'}
            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }} />
        )} />
      </Stack>
      <Typography sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
        Total a cobrar: {total == null ? 'Sin precio' : total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Typography>
    </Stack>
  )
}

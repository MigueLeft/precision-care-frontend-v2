import { useState } from 'react'
import { FormHelperText, MenuItem, Stack, TextField, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import {
  MONTH_LABELS,
  composePartialDate,
  daysInMonth,
  isValidPartialYear,
  parsePartialDate,
  type PartialDateParts,
} from '@/utils/partial-date'

type PartialDateFieldProps = {
  label: string
  value: string
  // Recibe 'YYYY-MM', 'YYYY-MM-DD' o '' mientras falte el mes o el año.
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  sx?: SxProps<Theme>
}

// Fecha con día opcional: basta con mes y año.
export function PartialDateField({
  label,
  value,
  onChange,
  disabled,
  error,
  helperText,
  sx,
}: PartialDateFieldProps) {
  const [parts, setParts] = useState<PartialDateParts>(() => parsePartialDate(value))
  const [lastValue, setLastValue] = useState(value)

  // El valor cambió desde fuera (ej. se limpió el formulario): se re-sincroniza.
  if (value !== lastValue) {
    setLastValue(value)
    if (value !== composePartialDate(parts)) setParts(parsePartialDate(value))
  }

  function update(changes: Partial<PartialDateParts>) {
    const next = { ...parts, ...changes }
    if (next.day && Number(next.day) > daysInMonth(next.year, next.month)) next.day = ''
    setParts(next)
    const composed = composePartialDate(next)
    setLastValue(composed)
    if (composed !== value) onChange(composed)
  }

  const yearInvalid = parts.year.length === 4 && !isValidPartialYear(parts.year)
  const days = Array.from({ length: daysInMonth(parts.year, parts.month) }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  )

  return (
    <Stack spacing={0.5} sx={sx}>
      <Typography sx={{ fontSize: '12px', color: error ? 'error.main' : 'text.secondary' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.75}>
        <TextField
          select
          size="small"
          label="Día"
          value={parts.day}
          disabled={disabled}
          onChange={(event) => update({ day: event.target.value })}
          sx={{ width: 76, flexShrink: 0 }}
        >
          <MenuItem value="">
            <em>—</em>
          </MenuItem>
          {days.map((day) => (
            <MenuItem key={day} value={day}>
              {Number(day)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Mes"
          value={parts.month}
          disabled={disabled}
          error={error}
          onChange={(event) => update({ month: event.target.value })}
          sx={{ flex: 1, minWidth: 110 }}
        >
          <MenuItem value="">
            <em>—</em>
          </MenuItem>
          {MONTH_LABELS.map((month, index) => (
            <MenuItem key={month} value={String(index + 1).padStart(2, '0')}>
              {month}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label="Año"
          value={parts.year}
          disabled={disabled}
          error={error || yearInvalid}
          onChange={(event) => update({ year: event.target.value.replace(/\D/g, '').slice(0, 4) })}
          slotProps={{ htmlInput: { inputMode: 'numeric', 'aria-label': `${label}: año` } }}
          sx={{ width: 84, flexShrink: 0 }}
        />
      </Stack>
      {(helperText || yearInvalid) && (
        <FormHelperText error={error || yearInvalid} sx={{ mx: 0 }}>
          {yearInvalid ? 'Año fuera de rango.' : helperText}
        </FormHelperText>
      )}
    </Stack>
  )
}

import { FormHelperText, MenuItem, Stack, TextField } from '@mui/material'
import {
  HOURS_12,
  composeTime24,
  minuteOptions,
  parseTime24,
  type Time12hParts,
} from '@/utils/time-12h'

type TimeField12hProps = {
  label: string
  // Hora en "HH:mm" (24 h); el selector la muestra en 12 h.
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  minuteStep?: number
  disabled?: boolean
  error?: boolean
  helperText?: string
}

// Hora en formato de 12 horas: hora, minutos y a. m./p. m. por separado.
export function TimeField12h({
  label,
  value,
  onChange,
  onBlur,
  minuteStep = 5,
  disabled,
  error,
  helperText,
}: TimeField12hProps) {
  const parts = parseTime24(value)
  const minutes = minuteOptions(minuteStep)
  // Un valor guardado fuera del paso (ej. 10:07) se conserva como opción.
  if (!minutes.includes(parts.minute)) minutes.push(parts.minute)
  minutes.sort()

  function update(changes: Partial<Time12hParts>) {
    onChange(composeTime24({ ...parts, ...changes }))
  }

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          label={label}
          value={parts.hour}
          disabled={disabled}
          error={error}
          onChange={(event) => update({ hour: Number(event.target.value) })}
          onBlur={onBlur}
          sx={{ flex: 1, minWidth: 72 }}
        >
          {HOURS_12.map((hour) => (
            <MenuItem key={hour} value={hour}>
              {hour}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Min"
          value={parts.minute}
          disabled={disabled}
          error={error}
          onChange={(event) => update({ minute: event.target.value })}
          onBlur={onBlur}
          sx={{ flex: 1, minWidth: 72 }}
        >
          {minutes.map((minute) => (
            <MenuItem key={minute} value={minute}>
              {minute}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="a. m./p. m."
          value={parts.period}
          disabled={disabled}
          error={error}
          onChange={(event) => update({ period: event.target.value as Time12hParts['period'] })}
          onBlur={onBlur}
          sx={{ flex: 1, minWidth: 88 }}
        >
          <MenuItem value="am">a. m.</MenuItem>
          <MenuItem value="pm">p. m.</MenuItem>
        </TextField>
      </Stack>
      {helperText && (
        <FormHelperText error={error} sx={{ mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Stack>
  )
}

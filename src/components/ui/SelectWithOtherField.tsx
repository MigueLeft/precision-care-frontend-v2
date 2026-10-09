import { useState } from 'react'
import { MenuItem, Stack, TextField } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

const OTHER = '__other__'

type SelectWithOtherFieldProps = {
  label: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  otherLabel?: string
  otherPlaceholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  sx?: SxProps<Theme>
}

// Select de opciones fijas con una opción "Otro" que habilita texto libre. El
// valor es el texto de la opción elegida o lo escrito en "Otro".
export function SelectWithOtherField({
  label,
  options,
  value,
  onChange,
  otherLabel = 'Otro',
  otherPlaceholder = 'Especifica…',
  disabled,
  error,
  helperText,
  sx,
}: SelectWithOtherFieldProps) {
  // "Otro" elegido pero aún sin texto (el valor sigue vacío).
  const [otherChosen, setOtherChosen] = useState(false)
  const isPreset = options.includes(value)
  const isOther = value !== '' ? !isPreset : otherChosen
  const selected = isOther ? OTHER : value

  function select(next: string) {
    setOtherChosen(next === OTHER)
    onChange(next === OTHER ? '' : next)
  }

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', ...sx }}>
      <TextField
        select
        size="small"
        label={label}
        value={selected}
        disabled={disabled}
        error={error}
        helperText={isOther ? undefined : helperText}
        onChange={(event) => select(event.target.value)}
        sx={{ flex: '1 1 170px', minWidth: 160 }}
      >
        <MenuItem value="">
          <em>—</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
        <MenuItem value={OTHER}>{otherLabel}</MenuItem>
      </TextField>
      {isOther && (
        <TextField
          size="small"
          autoFocus={value === ''}
          label={otherLabel}
          placeholder={otherPlaceholder}
          value={value}
          disabled={disabled}
          error={error}
          helperText={helperText}
          onChange={(event) => {
            setOtherChosen(true)
            onChange(event.target.value)
          }}
          sx={{ flex: '1 1 170px', minWidth: 160 }}
        />
      )}
    </Stack>
  )
}

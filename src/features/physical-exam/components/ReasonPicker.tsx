import { MenuItem, Stack, TextField } from '@mui/material'
import { OTHER_REASON, SKIP_REASONS } from '../config'

type ReasonPickerProps = {
  value: string | null
  disabled?: boolean
  onChange: (motivo: string) => void
}

// Motivo de "No examinado" / "Diferido". "Otro" se guarda como "Otro: <texto>".
export function ReasonPicker({ value, disabled, onChange }: ReasonPickerProps) {
  const isOther = value === OTHER_REASON || !!value?.startsWith(`${OTHER_REASON}:`)
  const selected = isOther ? OTHER_REASON : (value ?? '')
  const otherText = isOther ? (value ?? '').slice(OTHER_REASON.length + 1).trimStart() : ''

  return (
    // El texto de "Otro" va debajo del select, a todo el ancho.
    <Stack spacing={1} sx={{ mt: 1, maxWidth: 560 }}>
      <TextField
        select
        size="small"
        label="Motivo"
        value={selected}
        disabled={disabled}
        error={!value}
        onChange={(event) => onChange(event.target.value === OTHER_REASON ? `${OTHER_REASON}: ` : event.target.value)}
        fullWidth
      >
        {SKIP_REASONS.map((reason) => (
          <MenuItem key={reason} value={reason}>
            {reason}
          </MenuItem>
        ))}
      </TextField>
      {isOther && (
        <TextField
          size="small"
          label="Especifica el otro motivo"
          placeholder="Escribe el motivo…"
          autoFocus
          fullWidth
          multiline
          minRows={2}
          value={otherText}
          disabled={disabled}
          error={!otherText.trim()}
          onChange={(event) => onChange(`${OTHER_REASON}: ${event.target.value}`)}
        />
      )}
    </Stack>
  )
}

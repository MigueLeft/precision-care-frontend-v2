import { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type OnsetDateFieldProps = {
  value: string | null
  disabled: boolean
  sx?: object
  // Se llama al salir del campo (o al borrar) si el valor cambió.
  onCommit: (value: string) => void
}

// Fecha de inicio en texto libre ("2026-05", "2019"…) con botón interno de borrar.
export function OnsetDateField({ value, disabled, sx, onCommit }: OnsetDateFieldProps) {
  const [draft, setDraft] = useState(value ?? '')

  const commit = (next: string) => {
    if (next.trim() !== (value ?? '')) onCommit(next.trim())
  }

  return (
    <TextField
      size="small"
      label="Inicio"
      placeholder="2026-05 · 2019"
      value={draft}
      disabled={disabled}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => commit(draft)}
      sx={sx}
      slotProps={{
        input: {
          endAdornment: draft ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Borrar fecha de inicio"
                onClick={() => {
                  setDraft('')
                  commit('')
                }}
                disabled={disabled}
              >
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}

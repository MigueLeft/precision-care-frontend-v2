import type { ReactNode } from 'react'
import { Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

type CaptureToggleFieldProps<T extends string> = {
  title: string
  options: T[]
  labels: Record<T, string>
  value: T | null
  onChange: (value: T | null) => void
  // Las notas solo se muestran cuando `showNotes` es verdadero.
  showNotes: boolean
  notes: string
  onNotesChange: (notes: string) => void
  notesPlaceholder: string
  // Opción resaltada en rojo (ej. efecto adverso limitante).
  dangerOption?: T
  children?: ReactNode
}

// Grupo de captura de la consulta (adherencia, tolerancia): botones a todo el
// ancho cuyo texto se ajusta en varias líneas si la columna es angosta.
export function CaptureToggleField<T extends string>({
  title,
  options,
  labels,
  value,
  onChange,
  showNotes,
  notes,
  onNotesChange,
  notesPlaceholder,
  dangerOption,
  children,
}: CaptureToggleFieldProps<T>) {
  return (
    <Box>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>{title}</Typography>
      <ToggleButtonGroup
        size="small"
        exclusive
        fullWidth
        value={value}
        onChange={(_e, next: T | null) => onChange(next)}
      >
        {options.map((option) => (
          <ToggleButton
            key={option}
            value={option}
            color={option === dangerOption ? 'error' : undefined}
            sx={{ lineHeight: 1.25 }}
          >
            {labels[option]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {showNotes && (
        <TextField
          size="small"
          fullWidth
          placeholder={notesPlaceholder}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          sx={{ mt: 0.75 }}
        />
      )}
      {children}
    </Box>
  )
}

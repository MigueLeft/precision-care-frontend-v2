import { useDraftCommitField } from '@/hooks/useDraftCommitField'
import { TextField } from '@mui/material'

type SymptomNotesFieldProps = {
  value: string | null
  disabled: boolean
  // Clave del respaldo local en la consulta en curso.
  draftKey?: string
  // Se llama al salir del campo si el texto cambió.
  onCommit: (value: string) => void
}

const MAX_LENGTH = 500

// Notas del síntoma (texto libre). Se guardan al salir del campo.
export function SymptomNotesField({ value, disabled, draftKey, onCommit }: SymptomNotesFieldProps) {
  const [draft, setDraft] = useDraftCommitField(draftKey ?? null, value, onCommit, disabled)

  return (
    <TextField
      size="small"
      fullWidth
      multiline
      label="Notas"
      placeholder="Características, desencadenantes, evolución…"
      value={draft}
      disabled={disabled}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft.trim() !== (value ?? '')) onCommit(draft.trim())
      }}
      slotProps={{ htmlInput: { maxLength: MAX_LENGTH } }}
      sx={{ mt: 1 }}
    />
  )
}

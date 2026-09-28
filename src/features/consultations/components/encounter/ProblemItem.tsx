import { useState } from 'react'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

type ProblemItemProps = {
  value: string
  readOnly: boolean
  onChange: (value: string) => void
  onRemove: () => void
}

// Una nota de diagnóstico: se puede editar en línea para agregar detalles a lo
// que generó el sistema (Enter o salir del campo guarda, Escape cancela).
export function ProblemItem({ value, readOnly, onChange, onRemove }: ProblemItemProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    const clean = draft?.trim()
    if (clean && clean !== value) onChange(clean)
    setDraft(null)
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', bgcolor: 'action.hover', borderRadius: 1, px: 1.5, py: 0.75 }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
      {draft !== null ? (
        <TextField
          size="small"
          fullWidth
          multiline
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              commit()
            }
            if (event.key === 'Escape') setDraft(null)
          }}
        />
      ) : (
        <Typography sx={{ fontSize: '13px', flex: 1, whiteSpace: 'pre-wrap' }}>{value}</Typography>
      )}
      {!readOnly && draft === null && (
        <>
          <IconButton size="small" aria-label="Editar nota" onClick={() => setDraft(value)}>
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" aria-label="Quitar nota" onClick={onRemove}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </>
      )}
    </Stack>
  )
}

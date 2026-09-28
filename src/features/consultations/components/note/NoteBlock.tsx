import { Box, Typography } from '@mui/material'

type NoteBlockProps = {
  title: string
  children: React.ReactNode
}

// Bloque con título en versalitas de la nota de consulta.
export function NoteBlock({ title, children }: NoteBlockProps) {
  return (
    <Box>
      <Typography
        sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}

export function NoteEmpty() {
  return <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>—</Typography>
}

// Texto libre de la nota (respeta saltos de línea).
export function NoteText({ value }: { value: string | null | undefined }) {
  return (
    <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
      {value?.trim() ? value : '—'}
    </Typography>
  )
}

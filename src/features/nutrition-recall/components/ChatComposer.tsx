import { useState, type KeyboardEvent } from 'react'
import { IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

type ChatComposerProps = {
  disabled: boolean
  busy: boolean
  onSend: (text: string) => void
}

// Caja de respuesta del paciente: Enter envía, Shift+Enter agrega una línea.
export function ChatComposer({ disabled, busy, onSend }: ChatComposerProps) {
  const [text, setText] = useState('')
  const canSend = !disabled && text.trim().length > 0

  function submit() {
    if (!canSend) return
    onSend(text)
    setText('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <Paper square elevation={0} sx={{ borderTop: 1, borderColor: 'divider', px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
        <TextField
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={busy ? 'NutriBot está escribiendo...' : 'Escribe tu respuesta...'}
          disabled={disabled}
          multiline
          maxRows={4}
          fullWidth
          size="small"
          autoFocus
        />
        <IconButton color="primary" onClick={submit} disabled={!canSend} aria-label="Enviar mensaje">
          <SendRoundedIcon />
        </IconButton>
      </Stack>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.75, display: { xs: 'none', sm: 'block' } }}>
        Enter para enviar · Shift+Enter para nueva línea
      </Typography>
    </Paper>
  )
}

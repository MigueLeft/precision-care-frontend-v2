import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { AppButton } from '@/components/AppButton'

interface Props {
  open: boolean
  password: string
  onClose: () => void
}

export function TemporaryPasswordDialog({ open, password, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El navegador puede bloquear el portapapeles; el admin puede copiar a mano.
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Contraseña temporal</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Comparte esta contraseña con el especialista. Deberá cambiarla al iniciar sesión. No se
          volverá a mostrar.
        </DialogContentText>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TextField value={password} fullWidth slotProps={{ input: { readOnly: true } }} />
          <Tooltip title={copied ? 'Copiada' : 'Copiar'}>
            <IconButton onClick={copy} aria-label="Copiar contraseña">
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="contained" onClick={onClose}>
          Entendido
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

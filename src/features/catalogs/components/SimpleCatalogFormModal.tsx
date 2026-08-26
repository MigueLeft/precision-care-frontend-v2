import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface SimpleCatalogFormModalProps {
  open: boolean
  title: string
  showIsoCode?: boolean
  isSubmitting: boolean
  onSubmit: (values: { name: string; isoCode?: string }) => void
  onClose: () => void
}

export function SimpleCatalogFormModal({
  open,
  title,
  showIsoCode,
  isSubmitting,
  onSubmit,
  onClose,
}: SimpleCatalogFormModalProps) {
  const [name, setName] = useState('')
  const [isoCode, setIsoCode] = useState('')

  function resetAndClose() {
    setName('')
    setIsoCode('')
    onClose()
  }

  function handleSubmit() {
    onSubmit({ name: name.trim(), isoCode: isoCode.trim() || undefined })
    setName('')
    setIsoCode('')
  }

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <TextField label="Nombre" value={name} onChange={(event) => setName(event.target.value)} fullWidth autoFocus />
          {showIsoCode && (
            <TextField
              label="Código ISO"
              value={isoCode}
              onChange={(event) => setIsoCode(event.target.value.toUpperCase())}
              slotProps={{ htmlInput: { maxLength: 2 } }}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={resetAndClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          loading={isSubmitting}
          disabled={!name.trim() || (showIsoCode && isoCode.trim().length !== 2)}
          onClick={handleSubmit}
        >
          Agregar
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

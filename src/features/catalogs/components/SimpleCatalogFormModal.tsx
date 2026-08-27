import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'

const NAME_REGEX = /^[\p{L}\s'-]+$/u
const MAX_NAME_LENGTH = 100

interface SimpleCatalogFormModalProps {
  title: string
  showIsoCode?: boolean
  isSubmitting: boolean
  initialValues?: { name: string; isoCode?: string }
  onSubmit: (values: { name: string; isoCode?: string }) => void
  onClose: () => void
}

// Se monta solo mientras el diálogo debe mostrarse (ver SimpleCatalogList), por lo
// que el estado local siempre nace inicializado con los valores correctos, sin
// necesidad de sincronizarlo luego con un efecto.
export function SimpleCatalogFormModal({
  title,
  showIsoCode,
  isSubmitting,
  initialValues,
  onSubmit,
  onClose,
}: SimpleCatalogFormModalProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [isoCode, setIsoCode] = useState(initialValues?.isoCode ?? '')
  const [touched, setTouched] = useState(false)

  const trimmedName = name.trim()
  const nameError = !trimmedName
    ? null
    : trimmedName.length > MAX_NAME_LENGTH
      ? `El nombre no debe superar los ${MAX_NAME_LENGTH} caracteres.`
      : !NAME_REGEX.test(trimmedName)
        ? 'El nombre no debe contener números ni caracteres especiales.'
        : null

  const isValid = !!trimmedName && !nameError && (!showIsoCode || isoCode.trim().length === 2)

  function handleSubmit() {
    setTouched(true)
    if (!isValid) return
    onSubmit({ name: trimmedName, isoCode: isoCode.trim() || undefined })
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched(true)}
            error={touched && !!nameError}
            helperText={touched ? nameError : undefined}
            slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
            fullWidth
            autoFocus
          />
          {showIsoCode && (
            <TextField
              label="Código ISO"
              value={isoCode}
              onChange={(event) => setIsoCode(event.target.value.toUpperCase())}
              error={touched && isoCode.trim().length !== 2}
              helperText={touched && isoCode.trim().length !== 2 ? 'Debe tener 2 caracteres.' : undefined}
              slotProps={{ htmlInput: { maxLength: 2 } }}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} disabled={!isValid} onClick={handleSubmit}>
          {initialValues ? 'Guardar cambios' : 'Agregar'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

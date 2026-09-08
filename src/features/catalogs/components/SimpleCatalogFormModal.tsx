import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'

const NAME_REGEX = /^[\p{L}\s'-]+$/u
const MAX_NAME_LENGTH = 100

export interface SimpleCatalogFormValues {
  name: string
  isoCode?: string
  nationalityName?: string
}

interface SimpleCatalogFormModalProps {
  title: string
  showIsoCode?: boolean
  showNationality?: boolean
  isSubmitting: boolean
  initialValues?: SimpleCatalogFormValues
  onSubmit: (values: SimpleCatalogFormValues) => void
  onClose: () => void
}

// Se monta solo mientras el diálogo debe mostrarse (ver SimpleCatalogList), por lo
// que el estado local siempre nace inicializado con los valores correctos, sin
// necesidad de sincronizarlo luego con un efecto.
export function SimpleCatalogFormModal({
  title,
  showIsoCode,
  showNationality,
  isSubmitting,
  initialValues,
  onSubmit,
  onClose,
}: SimpleCatalogFormModalProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [isoCode, setIsoCode] = useState(initialValues?.isoCode ?? '')
  const [nationality, setNationality] = useState(initialValues?.nationalityName ?? '')
  const [touched, setTouched] = useState(false)

  const trimmedName = name.trim()
  const nameError = !trimmedName
    ? null
    : trimmedName.length > MAX_NAME_LENGTH
      ? `El nombre no debe superar los ${MAX_NAME_LENGTH} caracteres.`
      : !NAME_REGEX.test(trimmedName)
        ? 'El nombre no debe contener números ni caracteres especiales.'
        : null

  const trimmedNationality = nationality.trim()
  const nationalityError =
    showNationality && trimmedNationality && !NAME_REGEX.test(trimmedNationality)
      ? 'El nombre de nacionalidad no debe contener números ni caracteres especiales.'
      : null

  const isValid =
    !!trimmedName &&
    !nameError &&
    !nationalityError &&
    (!showIsoCode || isoCode.trim().length === 2)

  function handleSubmit() {
    setTouched(true)
    if (!isValid) return
    onSubmit({
      name: trimmedName,
      isoCode: showIsoCode ? isoCode.trim() || undefined : undefined,
      nationalityName: showNationality ? trimmedNationality || undefined : undefined,
    })
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
          {showNationality && (
            <TextField
              label="Nombre de nacionalidad"
              placeholder="Ej. Mexicana"
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
              error={touched && !!nationalityError}
              helperText={touched ? nationalityError : undefined}
              slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
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

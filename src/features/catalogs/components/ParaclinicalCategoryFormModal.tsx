import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'

const NAME_REGEX = /^[\p{L}\p{N}\s.,()/-]+$/u
const MAX_NAME_LENGTH = 100

interface ParaclinicalCategoryFormModalProps {
  title: string
  isSubmitting: boolean
  initialName?: string
  onSubmit: (name: string) => void
  onClose: () => void
}

// Se monta solo mientras debe mostrarse — el estado local nace ya inicializado.
export function ParaclinicalCategoryFormModal({
  title,
  isSubmitting,
  initialName,
  onSubmit,
  onClose,
}: ParaclinicalCategoryFormModalProps) {
  const [name, setName] = useState(initialName ?? '')
  const [touched, setTouched] = useState(false)

  const trimmed = name.trim()
  const error = !trimmed
    ? 'El nombre es requerido.'
    : trimmed.length > MAX_NAME_LENGTH
      ? `El nombre no debe superar los ${MAX_NAME_LENGTH} caracteres.`
      : !NAME_REGEX.test(trimmed)
        ? 'El nombre contiene caracteres no permitidos.'
        : null

  function handleSubmit() {
    setTouched(true)
    if (error) return
    onSubmit(trimmed)
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setTouched(true)}
          error={touched && !!error}
          helperText={touched ? error : undefined}
          slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
          fullWidth
          autoFocus
          sx={{ mt: 2.5 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          loading={isSubmitting}
          disabled={touched && !!error}
          onClick={handleSubmit}
        >
          {initialName ? 'Guardar cambios' : 'Agregar'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

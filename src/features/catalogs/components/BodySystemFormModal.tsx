import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { BodySystemFormFields } from './BodySystemFormFields'
import { bodySystemFormSchema } from '../schemas/body-system-form.schema'
import type { BodySystemFormValues } from '../schemas/body-system-form.schema'

interface BodySystemFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: BodySystemFormValues
  isSubmitting: boolean
  onSubmit: (values: BodySystemFormValues) => void
  onClose: () => void
}

export function BodySystemFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: BodySystemFormModalProps) {
  const { control, handleSubmit, reset } = useForm<BodySystemFormValues>({
    resolver: zodResolver(bodySystemFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar aparato / sistema' : 'Editar aparato / sistema'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <BodySystemFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

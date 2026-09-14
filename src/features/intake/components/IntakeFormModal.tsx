import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { IntakeFormFields } from './IntakeFormFields'
import { intakeFormSchema } from '../schemas/intake-form.schema'
import type { IntakeFormValues } from '../schemas/intake-form.schema'

interface IntakeFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: IntakeFormValues
  isSubmitting: boolean
  onSubmit: (values: IntakeFormValues) => void
  onClose: () => void
}

export function IntakeFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: IntakeFormModalProps) {
  const { control, handleSubmit, reset } = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nuevo ingresable' : 'Editar ingresable'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <IntakeFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear ingresable' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

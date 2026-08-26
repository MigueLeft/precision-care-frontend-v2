import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { MedicationFormFields } from './MedicationFormFields'
import { medicationFormSchema } from '../schemas/medication-form.schema'
import type { MedicationFormValues } from '../schemas/medication-form.schema'

interface MedicationFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: MedicationFormValues
  isSubmitting: boolean
  onSubmit: (values: MedicationFormValues) => void
  onClose: () => void
}

export function MedicationFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: MedicationFormModalProps) {
  const { control, handleSubmit, reset } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar medicamento' : 'Editar medicamento'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <MedicationFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear medicamento' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

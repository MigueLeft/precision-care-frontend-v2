import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { SymptomFormFields } from './SymptomFormFields'
import { symptomFormSchema } from '../schemas/symptom-form.schema'
import type { SymptomFormValues } from '../schemas/symptom-form.schema'

interface SymptomFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: SymptomFormValues
  isSubmitting: boolean
  onSubmit: (values: SymptomFormValues) => void
  onClose: () => void
}

export function SymptomFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: SymptomFormModalProps) {
  const { control, handleSubmit, reset } = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar síntoma' : 'Editar síntoma'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <SymptomFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear síntoma' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

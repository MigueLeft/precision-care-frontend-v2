import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { ExamFormFields } from './ExamFormFields'
import { examFormSchema } from '../schemas/exam-form.schema'
import type { ExamFormValues } from '../schemas/exam-form.schema'

interface ExamFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: ExamFormValues
  isSubmitting: boolean
  onSubmit: (values: ExamFormValues) => void
  onClose: () => void
}

export function ExamFormModal({ open, mode, initialValues, isSubmitting, onSubmit, onClose }: ExamFormModalProps) {
  const { control, handleSubmit, reset } = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar examen' : 'Editar examen'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <ExamFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear examen' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

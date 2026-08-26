import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { QuestionFormFields } from './QuestionFormFields'
import { questionFormSchema } from '../schemas/question-form.schema'
import type { QuestionFormValues } from '../schemas/question-form.schema'

interface QuestionFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: QuestionFormValues
  isSubmitting: boolean
  onSubmit: (values: QuestionFormValues) => void
  onClose: () => void
}

export function QuestionFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: QuestionFormModalProps) {
  const { control, handleSubmit, reset } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nueva pregunta' : 'Editar pregunta'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <QuestionFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear pregunta' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

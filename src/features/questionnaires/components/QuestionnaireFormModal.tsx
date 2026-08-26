import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { QuestionnaireFormFields } from './QuestionnaireFormFields'
import { questionnaireFormSchema } from '../schemas/questionnaire-form.schema'
import type { QuestionnaireFormValues } from '../schemas/questionnaire-form.schema'

interface QuestionnaireFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: QuestionnaireFormValues
  isSubmitting: boolean
  onSubmit: (values: QuestionnaireFormValues) => void
  onClose: () => void
}

export function QuestionnaireFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: QuestionnaireFormModalProps) {
  const { control, handleSubmit, reset } = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireFormSchema),
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
          <QuestionnaireFormFields control={control} />
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

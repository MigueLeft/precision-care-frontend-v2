import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { SectionFormFields } from './SectionFormFields'
import { sectionFormSchema } from '../schemas/section-form.schema'
import type { SectionFormValues } from '../schemas/section-form.schema'

interface SectionFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: SectionFormValues
  isSubmitting: boolean
  onSubmit: (values: SectionFormValues) => void
  onClose: () => void
}

export function SectionFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: SectionFormModalProps) {
  const { control, handleSubmit, reset } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nueva sección' : 'Editar sección'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <SectionFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear sección' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

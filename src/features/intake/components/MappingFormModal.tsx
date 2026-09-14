import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { MappingFormFields } from './MappingFormFields'
import { mappingFormSchema } from '../schemas/mapping-form.schema'
import type { MappingFormValues } from '../schemas/mapping-form.schema'

interface MappingFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: MappingFormValues
  isSubmitting: boolean
  onSubmit: (values: MappingFormValues) => void
  onClose: () => void
}

export function MappingFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: MappingFormModalProps) {
  const { control, handleSubmit, reset } = useForm<MappingFormValues>({
    resolver: zodResolver(mappingFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nuevo mapeo' : 'Editar mapeo'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <MappingFormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear mapeo' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

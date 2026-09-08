import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { ParaclinicalFormFields } from './ParaclinicalFormFields'
import { createParaclinicalFormSchema } from '../schemas/paraclinical-form.schema'
import type { ParaclinicalFormValues } from '../schemas/paraclinical-form.schema'

interface ParaclinicalFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: ParaclinicalFormValues
  isSubmitting: boolean
  /** Nombres de los demás paraclínicos ya guardados, para bloquear duplicados. */
  existingNames?: string[]
  onSubmit: (values: ParaclinicalFormValues) => void
  onClose: () => void
}

export function ParaclinicalFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  existingNames = [],
  onSubmit,
  onClose,
}: ParaclinicalFormModalProps) {
  const { control, handleSubmit, reset, setValue } = useForm<ParaclinicalFormValues>({
    resolver: zodResolver(createParaclinicalFormSchema(existingNames)),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Agregar paraclínico' : 'Editar paraclínico'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <ParaclinicalFormFields control={control} setValue={setValue} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear paraclínico' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

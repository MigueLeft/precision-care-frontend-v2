import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { UserFormFields } from './UserFormFields'
import { getUserFormSchema } from '../schemas/user-form.schema'
import type { UserFormValues } from '../schemas/user-form.schema'

interface UserFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: UserFormValues
  isSubmitting: boolean
  onSubmit: (values: UserFormValues) => void
  onClose: () => void
}

export function UserFormModal({ open, mode, initialValues, isSubmitting, onSubmit, onClose }: UserFormModalProps) {
  const { control, handleSubmit, reset } = useForm<UserFormValues>({
    resolver: zodResolver(getUserFormSchema(mode)),
    defaultValues: initialValues,
  })

  const type = useWatch({ control, name: 'type' })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <UserFormFields control={control} mode={mode} type={type} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

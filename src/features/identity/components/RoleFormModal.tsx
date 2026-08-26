import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { roleFormSchema } from '../schemas/role-form.schema'
import type { RoleFormValues } from '../schemas/role-form.schema'

interface RoleFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: RoleFormValues
  isSubmitting: boolean
  onSubmit: (values: RoleFormValues) => void
  onClose: () => void
}

export function RoleFormModal({ open, mode, initialValues, isSubmitting, onSubmit, onClose }: RoleFormModalProps) {
  const { control, handleSubmit, reset } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nuevo rol' : 'Editar rol'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Nombre del rol" fullWidth error={!!error} helperText={error?.message} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Descripción" fullWidth multiline minRows={2} />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear rol' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

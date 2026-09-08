import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { AppointmentFormFields } from './AppointmentFormFields'
import {
  appointmentFormSchema,
  appointmentFormDefaultValues,
  type AppointmentFormValues,
} from '../schemas/appointment-form.schema'

interface AppointmentFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: AppointmentFormValues
  lockPatient?: boolean
  isSubmitting: boolean
  onSubmit: (values: AppointmentFormValues) => void
  onClose: () => void
}

export function AppointmentFormModal({
  open,
  mode,
  initialValues,
  lockPatient,
  isSubmitting,
  onSubmit,
  onClose,
}: AppointmentFormModalProps) {
  const values = initialValues ?? appointmentFormDefaultValues
  const { control, handleSubmit, reset } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: values,
  })

  useEffect(() => {
    if (open) reset(values)
  }, [open, values, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nueva cita' : 'Editar cita'}</DialogTitle>
      <DialogContent>
        <AppointmentFormFields control={control} lockPatient={lockPatient} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear cita' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}

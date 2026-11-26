import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { AppointmentFormFields } from './AppointmentFormFields'
import { useSpecialistsLookup } from '@/features/identity'
import { PricingFields } from '@/components/ui/PricingFields'
import {
  getAppointmentFormSchema,
  appointmentFormDefaultValues,
  type AppointmentFormValues,
} from '../schemas/appointment-form.schema'

type AppointmentFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: AppointmentFormValues
  lockPatient?: boolean
  priceLocked?: boolean
  isSubmitting: boolean
  onSubmit: (values: AppointmentFormValues) => void
  onClose: () => void
}

export function AppointmentFormModal(props: AppointmentFormModalProps) {
  const lookup = useSpecialistsLookup()
  if (!props.open) return null
  if (lookup.isLoading) return <Dialog open fullWidth maxWidth="sm"><DialogTitle>Cargando formulario de cita</DialogTitle><DialogContent><CircularProgress size={24} /></DialogContent></Dialog>
  const values = props.initialValues ?? appointmentFormDefaultValues
  const initialValues = props.mode === 'create' && values.basePrice == null
    ? { ...values, basePrice: lookup.data?.find((s) => s.id === values.specialistId)?.defaultAppointmentPrice ?? null }
    : values
  return <AppointmentFormDialog {...props} initialValues={initialValues} />
}

function AppointmentFormDialog({
  mode,
  initialValues,
  lockPatient,
  priceLocked,
  isSubmitting,
  onSubmit,
  onClose,
}: AppointmentFormModalProps) {
  const values = initialValues ?? appointmentFormDefaultValues
  // En el teléfono (app de citas) el formulario ocupa toda la pantalla.
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'))
  const { control, handleSubmit, setValue } = useForm<AppointmentFormValues>({
    resolver: zodResolver(getAppointmentFormSchema(mode)),
    defaultValues: values,
  })

  return (
    <Dialog open onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>{mode === 'create' ? 'Nueva cita' : 'Editar cita'}</DialogTitle>
      <DialogContent>
        <AppointmentFormFields control={control} setValue={setValue} lockPatient={lockPatient} priceLocked={priceLocked} />
        <Stack spacing={1} sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">Precio de la cita en USD{priceLocked ? ' · Pagada: importe protegido' : ''}</Typography>
          <PricingFields control={control} disabled={priceLocked} />
        </Stack>
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

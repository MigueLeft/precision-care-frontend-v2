import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import { AppButton } from '@/components/AppButton'
import { canConfirmAppointments, useMe } from '@/features/identity'
import { useUpdateAppointment } from '../hooks/useAppointmentMutations'
import type { Appointment } from '../types'

type ConfirmAppointmentButtonProps = {
  appointment: Appointment
}

// Recepción/administración (o quien creó la cita) la confirma: solo entonces
// aparece en la lista del médico. También se puede quitar la confirmación.
export function ConfirmAppointmentButton({ appointment }: ConfirmAppointmentButtonProps) {
  const { data: me } = useMe()
  const update = useUpdateAppointment()

  const isCreator = me != null && appointment.createdBy === me.id && me.permissions.includes('citas:update')
  if (!canConfirmAppointments(me) && !isCreator) return null

  if (appointment.status === 'scheduled') {
    return (
      <AppButton
        variant="contained"
        color="success"
        startIcon={<EventAvailableIcon sx={{ fontSize: 18 }} />}
        loading={update.isPending}
        onClick={() => update.mutate({ id: appointment.id, payload: { status: 'confirmed' } })}
      >
        Confirmar cita
      </AppButton>
    )
  }

  if (appointment.status === 'confirmed') {
    return (
      <AppButton
        variant="outlined"
        color="inherit"
        startIcon={<EventBusyOutlinedIcon sx={{ fontSize: 18 }} />}
        loading={update.isPending}
        onClick={() => update.mutate({ id: appointment.id, payload: { status: 'scheduled' } })}
      >
        Quitar confirmación
      </AppButton>
    )
  }

  return null
}

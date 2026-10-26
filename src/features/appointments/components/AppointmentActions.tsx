import { Stack, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { hasPermission, useMe, VIEW_ALL_APPOINTMENTS } from '@/features/identity'
import { useConsultationByAppointment } from '@/features/consultations'
import type { Appointment } from '../types'
import { getPrimarySpecialist, isCancelled } from '../utils/appointment-helpers'
import { useStartConsultation, useSendReminder } from '../hooks/useAppointmentMutations'
import { SendIntakeAssignmentButton } from './SendIntakeAssignmentButton'
import { ConfirmAppointmentButton } from './ConfirmAppointmentButton'

interface AppointmentActionsProps {
  appointment: Appointment
  onEdit: () => void
  onCancel: () => void
}

export function AppointmentActions({ appointment, onEdit, onCancel }: AppointmentActionsProps) {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { data: linkedConsultation } = useConsultationByAppointment(appointment.id)
  const startMutation = useStartConsultation({
    onSuccess: (result) =>
      navigate({
        to: '/consultas/$consultationId',
        params: { consultationId: String(result.consultation.id) },
      }),
  })
  const reminderMutation = useSendReminder()

  const primary = getPrimarySpecialist(appointment)
  const isAssignedSpecialist =
    me?.specialistId != null && me.specialistId === primary?.specialistId
  const can = (code: string) => hasPermission(me, code)
  // Con el permiso se puede ver (no editar) la consulta de otro médico.
  const canViewConsultation =
    can('consultas:read') && (isAssignedSpecialist || can(VIEW_ALL_APPOINTMENTS))
  const canStart = isAssignedSpecialist && can('consultas:create') && can('citas:update')
  const canUpdate = can('citas:update')

  function goToConsultation() {
    if (!linkedConsultation) return
    navigate({
      to: '/consultas/$consultationId',
      params: { consultationId: String(linkedConsultation.id) },
    })
  }

  if (isCancelled(appointment.status)) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 2 }}>
        Esta cita fue cancelada.
      </Typography>
    )
  }

  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      {appointment.status === 'in_progress' && isAssignedSpecialist && can('consultas:read') && (
        <AppButton
          variant="contained"
          startIcon={<PlayArrowIcon sx={{ fontSize: 18 }} />}
          disabled={!linkedConsultation}
          onClick={goToConsultation}
        >
          Continuar consulta
        </AppButton>
      )}

      {(appointment.status === 'completed' ||
        (appointment.status === 'in_progress' && !isAssignedSpecialist)) &&
        canViewConsultation && (
        <AppButton
          variant="outlined"
          startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />}
          disabled={!linkedConsultation}
          onClick={goToConsultation}
        >
          Ver consulta
        </AppButton>
      )}

      {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
        <>
          <ConfirmAppointmentButton appointment={appointment} />
          {canStart && (
            <AppButton
              variant="contained"
              startIcon={<PlayArrowIcon sx={{ fontSize: 18 }} />}
              loading={startMutation.isPending}
              onClick={() => startMutation.mutate(appointment.id)}
            >
              Iniciar consulta
            </AppButton>
          )}
          {canUpdate && (
            <>
              <AppButton
                variant="outlined"
                startIcon={<PlaylistAddCheckIcon sx={{ fontSize: 18 }} />}
                onClick={() =>
                  navigate({
                    to: '/citas/$appointmentId/precarga',
                    params: { appointmentId: String(appointment.id) },
                  })
                }
              >
                Precargar datos de la consulta
              </AppButton>
              <AppButton
                variant="outlined"
                startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={onEdit}
              >
                Editar cita
              </AppButton>
              <AppButton
                variant="outlined"
                color="error"
                startIcon={<CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                onClick={onCancel}
              >
                Cancelar cita
              </AppButton>
              <AppButton
                variant="text"
                startIcon={<NotificationsNoneIcon sx={{ fontSize: 16 }} />}
                loading={reminderMutation.isPending}
                onClick={() => reminderMutation.mutate(appointment.id)}
              >
                Enviar recordatorio manual
              </AppButton>
              <SendIntakeAssignmentButton
                appointmentId={appointment.id}
                patientId={appointment.patientId}
              />
            </>
          )}
        </>
      )}
    </Stack>
  )
}

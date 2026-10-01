import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu, MenuItem, ListItemText } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { AppButton } from '@/components/AppButton'
import { useIntakes } from '@/features/intake'
import { intakeResponsesKeys, useIntakeResponsesByPatient } from '@/features/intake-responses'
import { useSendIntakeAssignment } from '../hooks/useAppointmentMutations'

interface SendIntakeAssignmentButtonProps {
  appointmentId: number
  patientId: number
}

// Botón + menú para asignar un ingresable activo a la cita. Se lista cada
// ingresable activo con versión publicada; al elegir uno se dispara la
// asignación (y su notificación por email si aplica). Un ingresable que el
// paciente tiene pendiente no se puede volver a enviar hasta que lo complete.
export function SendIntakeAssignmentButton({
  appointmentId,
  patientId,
}: SendIntakeAssignmentButtonProps) {
  const queryClient = useQueryClient()
  const { data: intakes = [] } = useIntakes()
  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const intakeAssignmentMutation = useSendIntakeAssignment({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: intakeResponsesKeys.byPatient(patientId) }),
  })

  const pendingIntakeIds = new Set(
    responses.filter((response) => !response.completed).map((response) => response.intakeId),
  )
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const activeIntakes = intakes.filter(
    (intake) => intake.active && intake.currentVersionId != null,
  )

  function handleOpen(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSend(intakeVersionId: number) {
    handleClose()
    intakeAssignmentMutation.mutate({ appointmentId, intakeVersionId })
  }

  return (
    <>
      <AppButton
        variant="text"
        startIcon={<AssignmentOutlinedIcon sx={{ fontSize: 16 }} />}
        loading={intakeAssignmentMutation.isPending}
        disabled={activeIntakes.length === 0}
        onClick={handleOpen}
      >
        Enviar ingresable
      </AppButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        {activeIntakes.map((intake) => (
          <MenuItem
            key={intake.id}
            disabled={pendingIntakeIds.has(intake.id)}
            onClick={() => handleSend(intake.currentVersionId as number)}
          >
            <ListItemText
              secondary={pendingIntakeIds.has(intake.id) ? 'Pendiente de completar' : undefined}
            >
              {intake.name}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

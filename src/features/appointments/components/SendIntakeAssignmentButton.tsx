import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu, MenuItem, ListItemText } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { AppButton } from '@/components/AppButton'
import { useIntakes } from '@/features/intake'
import { useSendIntakeAssignment } from '../hooks/useAppointmentMutations'

interface SendIntakeAssignmentButtonProps {
  appointmentId: number
}

// Botón + menú para asignar un ingresable activo a la cita. Se lista cada
// ingresable activo con versión publicada; al elegir uno se dispara la
// asignación (y su notificación por email si aplica).
export function SendIntakeAssignmentButton({
  appointmentId,
}: SendIntakeAssignmentButtonProps) {
  const { data: intakes = [] } = useIntakes()
  const intakeAssignmentMutation = useSendIntakeAssignment()
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
            onClick={() => handleSend(intake.currentVersionId as number)}
          >
            <ListItemText>{intake.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

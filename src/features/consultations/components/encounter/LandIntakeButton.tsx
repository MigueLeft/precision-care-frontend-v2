import { useState } from 'react'
import { Tooltip } from '@mui/material'
import MoveToInboxOutlinedIcon from '@mui/icons-material/MoveToInboxOutlined'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useIntakeResponsesByPatient } from '@/features/intake-responses'
import { useLandConsultationIntake } from '../../hooks/useLandConsultationIntake'
import type { Consultation } from '../../types'

type LandIntakeButtonProps = {
  consultation: Consultation
}

// Solo en la primera consulta: vuelca al expediente lo que el paciente
// respondió en su formulario de ingreso (síntomas, antecedentes, cirugías,
// hospitalizaciones y medicamentos). No incluye valores físicos ni de laboratorio.
export function LandIntakeButton({ consultation }: LandIntakeButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { data: responses = [] } = useIntakeResponsesByPatient(consultation.patientId)
  const landMutation = useLandConsultationIntake(consultation.id, consultation.patientId)

  const hasCompletedIntake = responses.some((response) => response.completed)

  return (
    <>
      <Tooltip
        title={hasCompletedIntake ? '' : 'El paciente aún no ha completado su formulario de ingreso.'}
      >
        <span>
          <AppButton
            variant="outlined"
            size="small"
            startIcon={<MoveToInboxOutlinedIcon sx={{ fontSize: 16 }} />}
            disabled={!hasCompletedIntake}
            loading={landMutation.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Aterrizar información
          </AppButton>
        </span>
      </Tooltip>

      <ConfirmDialog
        open={confirmOpen}
        title="Aterrizar información"
        description="Se agregarán a la consulta los síntomas, antecedentes, cirugías, hospitalizaciones y medicamentos que el paciente respondió en su formulario de ingreso. Los valores físicos y de laboratorio no se incluyen. ¿Continuar?"
        confirmLabel="Aterrizar"
        color="primary"
        isConfirming={landMutation.isPending}
        onConfirm={() => landMutation.mutate(undefined, { onSettled: () => setConfirmOpen(false) })}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

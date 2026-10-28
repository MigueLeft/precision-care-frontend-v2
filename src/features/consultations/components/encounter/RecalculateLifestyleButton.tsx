import { useState } from 'react'
import { Tooltip } from '@mui/material'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useIntakeResponsesByPatient } from '@/features/intake-responses'
import { useRecalculateLifestyle } from '../../hooks/useRecalculateLifestyle'

type RecalculateLifestyleButtonProps = {
  consultationId: number
  patientId: number
}

// Vuelve a calcular el estilo de vida (Life's Essential 8) y demás scores
// del último formulario de ingreso completado del paciente, con las
// respuestas que ya guardó (no requiere que lo vuelva a llenar). Pensado
// para usarse tras corregir una pregunta/mapeo del IM1.
export function RecalculateLifestyleButton({
  consultationId,
  patientId,
}: RecalculateLifestyleButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const recalculateMutation = useRecalculateLifestyle(consultationId, patientId)

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
            startIcon={<AutorenewOutlinedIcon sx={{ fontSize: 16 }} />}
            disabled={!hasCompletedIntake}
            loading={recalculateMutation.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Recalcular IM1
          </AppButton>
        </span>
      </Tooltip>

      <ConfirmDialog
        open={confirmOpen}
        title="Recalcular IM1"
        description="Se volverá a calcular el estilo de vida (Life's Essential 8) y los demás resultados del formulario de ingreso con las respuestas que el paciente ya guardó. Reemplaza la evaluación de estilo de vida actual. ¿Continuar?"
        confirmLabel="Recalcular"
        color="primary"
        isConfirming={recalculateMutation.isPending}
        onConfirm={() => recalculateMutation.mutate(undefined, { onSettled: () => setConfirmOpen(false) })}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

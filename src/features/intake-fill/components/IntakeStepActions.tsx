import { Box } from '@mui/material'
import { AppButton } from '@/components/AppButton'

interface IntakeStepActionsProps {
  isFirstStep: boolean
  isLastStep: boolean
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function IntakeStepActions({
  isFirstStep,
  isLastStep,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: IntakeStepActionsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 4 }}>
      <AppButton variant="outlined" size="large" disabled={isFirstStep || submitting} onClick={onBack}>
        Atrás
      </AppButton>
      {isLastStep ? (
        <AppButton variant="contained" size="large" loading={submitting} onClick={onSubmit}>
          Enviar formulario
        </AppButton>
      ) : (
        <AppButton variant="contained" size="large" onClick={onNext}>
          Siguiente
        </AppButton>
      )}
    </Box>
  )
}

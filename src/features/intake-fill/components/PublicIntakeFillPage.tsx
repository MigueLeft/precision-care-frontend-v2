import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { useIntakeFillFlow } from '../hooks/useIntakeFillFlow'
import { usePublicIntakeResponse } from '../hooks/usePublicIntakeResponse'
import { IntakeCompletedCard } from './IntakeCompletedCard'
import { IntakeStepActions } from './IntakeStepActions'
import { IntakeStepContent } from './IntakeStepContent'
import { IntakeStepHeader } from './IntakeStepHeader'

interface PublicIntakeFillPageProps {
  token: string
}

export function PublicIntakeFillPage({ token }: PublicIntakeFillPageProps) {
  const { data: response, isLoading, isError, error } = usePublicIntakeResponse(token)
  const flow = useIntakeFillFlow(token, response)
  const patient = response?.patient
  const patientName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'brand.dark', color: '#ffffff', px: { xs: 2, sm: 4 }, py: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>Precisión Care</Typography>
      </Box>

      <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {isLoading && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <EmptyState message={getApiErrorMessage(error, 'Este formulario no existe o el enlace ya no es válido.')} />
        )}

        {response && (response.completed || flow.justCompleted) && <IntakeCompletedCard />}

        {response && !response.completed && !flow.justCompleted && flow.step && (
          <Stack spacing={2.5}>
            <IntakeStepHeader
              intakeName={response.intakeName ?? 'Formulario'}
              patientName={patientName}
              stepTitle={flow.step.title}
              stepIndex={flow.stepIndex}
              totalSteps={flow.steps.length}
            />
            <IntakeStepContent
              step={flow.step}
              answers={flow.answers}
              questionIndex={flow.questionIndex}
              onAnswer={flow.setAnswer}
            />
            <IntakeStepActions
              isFirstStep={flow.stepIndex === 0}
              isLastStep={flow.isLastStep}
              submitting={flow.submitting}
              onBack={flow.back}
              onNext={flow.next}
              onSubmit={flow.submit}
            />
          </Stack>
        )}
      </Box>
    </Box>
  )
}

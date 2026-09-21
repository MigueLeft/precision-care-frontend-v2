import { Box, LinearProgress, Typography } from '@mui/material'

interface IntakeStepHeaderProps {
  intakeName: string
  patientName: string | null
  stepTitle: string
  stepIndex: number
  totalSteps: number
}

// Título del formulario, paciente al que corresponde y progreso por pasos.
export function IntakeStepHeader({
  intakeName,
  patientName,
  stepTitle,
  stepIndex,
  totalSteps,
}: IntakeStepHeaderProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{intakeName}</Typography>
      {patientName && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          Paciente: <strong>{patientName}</strong>
        </Typography>
      )}
      <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 2, mb: 0.75 }}>
        Paso {stepIndex + 1} de {totalSteps} · {stepTitle}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={((stepIndex + 1) / totalSteps) * 100}
        sx={{ borderRadius: '4px', height: 6 }}
      />
    </Box>
  )
}

import { Box, Stack, Typography } from '@mui/material'
import { useConsultationsByPatient } from '@/features/consultations'

interface PatientDrawerCareTeamProps {
  patientId: number
}

// Especialista de referencia: el de la consulta más reciente del paciente.
export function PatientDrawerCareTeam({ patientId }: PatientDrawerCareTeamProps) {
  const { data = [] } = useConsultationsByPatient(patientId)
  const primarySpecialist = data.find((c) => c.specialistName)?.specialistName

  if (!primarySpecialist) return null

  return (
    <Box sx={{ px: 3, mt: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', py: 1 }}>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Especialista principal
        </Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
          {primarySpecialist}
        </Typography>
      </Stack>
    </Box>
  )
}

import { Box, Stack, Typography, Chip, CircularProgress } from '@mui/material'
import { EmptyState } from '@/components/EmptyState'
import { usePatientAllergies } from '../hooks/usePatientAllergies'
import { allergySeverityColor, formatAllergyLabel } from '../utils/allergy-format'

interface PatientDrawerAllergiesProps {
  patientId: number
}

export function PatientDrawerAllergies({ patientId }: PatientDrawerAllergiesProps) {
  const { data: allergies = [], isLoading } = usePatientAllergies(patientId)

  return (
    <Box sx={{ px: 3, mt: 2 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'brand.dark', mb: 1 }}>
        Alergias
      </Typography>

      {isLoading && <CircularProgress size={20} />}

      {!isLoading && allergies.length === 0 && (
        <EmptyState message="Sin alergias registradas." />
      )}

      {!isLoading && allergies.length > 0 && (
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {allergies.map((allergy) => (
            <Chip
              key={allergy.id}
              label={formatAllergyLabel(allergy)}
              color={allergySeverityColor(allergy.severityName)}
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

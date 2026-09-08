import { Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import {
  usePatientAllergies,
  ALLERGY_TYPE_LABELS,
  ALLERGY_SEVERITY_LABELS,
} from '@/features/patients'

interface AlergiasCardProps {
  patientId: number
}

export function AlergiasCard({ patientId }: AlergiasCardProps) {
  const { data = [], isLoading } = usePatientAllergies(patientId)

  return (
    <SectionCard title="Alergias">
      {!isLoading && data.length === 0 && (
        <EmptyState message="Sin alergias registradas." />
      )}

      <Stack spacing={1.5}>
        {data.map((allergy) => (
          <Stack
            key={allergy.id}
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.error.main, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.error.main, 0.2),
            })}
          >
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
              {allergy.description}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {ALLERGY_TYPE_LABELS[allergy.type]}
              {allergy.severity
                ? ` · Severidad: ${ALLERGY_SEVERITY_LABELS[allergy.severity]}`
                : ''}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  )
}

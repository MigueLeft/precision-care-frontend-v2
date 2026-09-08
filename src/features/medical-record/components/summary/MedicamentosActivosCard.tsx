import { Box, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import {
  usePatientMedications,
  getCurrentMedications,
  formatMedicationName,
} from '@/features/patient-medications'

interface MedicamentosActivosCardProps {
  patientId: number
}

export function MedicamentosActivosCard({ patientId }: MedicamentosActivosCardProps) {
  const { data = [], isLoading } = usePatientMedications(patientId)
  const current = getCurrentMedications(data)

  return (
    <SectionCard
      title="Medicamentos activos"
      action={
        <Link
          to="/pacientes/$patientId/medicamentos"
          params={{ patientId: String(patientId) }}
          style={{ textDecoration: 'none' }}
        >
          <Typography sx={{ fontSize: '13px', color: 'primary.main', fontWeight: 600 }}>
            Gestionar
          </Typography>
        </Link>
      }
    >
      {!isLoading && current.length === 0 && (
        <EmptyState message="Sin medicamentos activos." />
      )}

      <Stack spacing={1.5}>
        {current.map((medication) => (
          <Box key={medication.id}>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
              {formatMedicationName(medication)}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {[medication.frequency, medication.duration].filter(Boolean).join(' · ') ||
                'Sin indicación'}
            </Typography>
          </Box>
        ))}
      </Stack>
    </SectionCard>
  )
}

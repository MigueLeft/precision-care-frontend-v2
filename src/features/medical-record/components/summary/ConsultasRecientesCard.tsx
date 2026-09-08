import { Box, Stack, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link } from '@tanstack/react-router'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import { useConsultationsByPatient } from '@/features/consultations'
import { formatShortDate } from '../../utils/clinical-format'

interface ConsultasRecientesCardProps {
  patientId: number
}

export function ConsultasRecientesCard({ patientId }: ConsultasRecientesCardProps) {
  const { data = [], isLoading } = useConsultationsByPatient(patientId)
  const recent = data.slice(0, 3)

  return (
    <SectionCard
      title="Consultas recientes"
      action={
        <Link
          to="/pacientes/$patientId/consultas"
          params={{ patientId: String(patientId) }}
          style={{ textDecoration: 'none' }}
        >
          <Typography sx={{ fontSize: '13px', color: 'primary.main', fontWeight: 600 }}>
            Ver todas
          </Typography>
        </Link>
      }
    >
      {!isLoading && recent.length === 0 && (
        <EmptyState message="Sin consultas registradas." />
      )}

      <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
        {recent.map((consultation) => (
          <Link
            key={consultation.id}
            to="/pacientes/$patientId/consultas"
            params={{ patientId: String(patientId) }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }} noWrap>
                  {consultation.consultationReason ?? 'Consulta'}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {formatShortDate(consultation.startAt)}
                  {consultation.specialistName ? ` · ${consultation.specialistName}` : ''}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Stack>
          </Link>
        ))}
      </Stack>
    </SectionCard>
  )
}

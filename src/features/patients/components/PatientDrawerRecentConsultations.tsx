import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link } from '@tanstack/react-router'
import { EmptyState } from '@/components/EmptyState'
import { useConsultationsByPatient } from '@/features/consultations'

interface PatientDrawerRecentConsultationsProps {
  patientId: number
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function PatientDrawerRecentConsultations({
  patientId,
}: PatientDrawerRecentConsultationsProps) {
  const { data = [], isLoading } = useConsultationsByPatient(patientId)
  const recent = data.slice(0, 3)

  return (
    <Box sx={{ px: 3, mt: 2 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'brand.dark', mb: 1 }}>
        Consultas recientes
      </Typography>

      {isLoading && <CircularProgress size={20} />}

      {!isLoading && recent.length === 0 && (
        <EmptyState message="Sin consultas registradas." />
      )}

      <Stack spacing={0.5}>
        {recent.map((consultation) => (
          <Link
            key={consultation.id}
            to="/pacientes/$patientId/consultas"
            params={{ patientId: String(patientId) }}
            style={{ textDecoration: 'none' }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
                px: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }} noWrap>
                  {consultation.consultationReason ?? 'Consulta'}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {formatDate(consultation.startAt)}
                </Typography>
              </Box>
              <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Stack>
          </Link>
        ))}
      </Stack>
    </Box>
  )
}

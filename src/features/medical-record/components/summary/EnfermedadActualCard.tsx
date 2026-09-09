import { Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import { useConsultationsByPatient } from '@/features/consultations'
import { formatShortDate } from '../../utils/clinical-format'

interface EnfermedadActualCardProps {
  patientId: number
}

export function EnfermedadActualCard({ patientId }: EnfermedadActualCardProps) {
  const { data = [], isLoading } = useConsultationsByPatient(patientId)
  // La enfermedad actual más reciente registrada en una consulta.
  const latest = data.find((consultation) => consultation.currentIllness?.trim())

  return (
    <SectionCard
      title="Enfermedad actual"
      action={
        latest ? (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(latest.startAt)}
          </Typography>
        ) : undefined
      }
    >
      {!isLoading && !latest && (
        <EmptyState message="Sin enfermedad actual registrada." />
      )}
      {latest && (
        <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
          {latest.currentIllness}
        </Typography>
      )}
    </SectionCard>
  )
}

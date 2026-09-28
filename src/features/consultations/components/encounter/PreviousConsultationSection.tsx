import { Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import { useConsultationsByPatient } from '../../hooks/useConsultationsByPatient'
import { ConsultationNote } from '../note/ConsultationNote'
import type { Consultation } from '../../types'

type PreviousConsultationSectionProps = {
  index: number
  consultation: Consultation
}

// Consulta subsecuente: la nota generada por el sistema con todo lo registrado
// en la consulta anterior (la misma que se ve en el expediente › Consultas).
export function PreviousConsultationSection({ index, consultation }: PreviousConsultationSectionProps) {
  const { data: consultations = [] } = useConsultationsByPatient(consultation.patientId)

  const startAt = new Date(consultation.startAt).getTime()
  // La lista viene de más reciente a más antigua.
  const previous = consultations.find(
    (c) => c.id !== consultation.id && new Date(c.startAt).getTime() < startAt,
  )

  return (
    <CollapsibleSection
      title={`${index}. Nota de la consulta anterior`}
      headerMeta={
        previous ? (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(previous.startAt)}
            {previous.specialistName ? ` · ${previous.specialistName}` : ''}
          </Typography>
        ) : undefined
      }
      defaultExpanded
    >
      {previous ? (
        <ConsultationNote consultation={previous} />
      ) : (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
          No hay una consulta anterior registrada.
        </Typography>
      )}
    </CollapsibleSection>
  )
}

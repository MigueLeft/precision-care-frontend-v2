import { Box, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { formatConsultationReason } from '../utils/consultation-format'
import { ConsultationNote } from './note/ConsultationNote'
import type { Consultation } from '../types'

interface ConsultationDetailProps {
  consultation: Consultation
}

export function ConsultationDetail({ consultation }: ConsultationDetailProps) {
  return (
    <SectionCard
      title={
        <Box>
          <Typography variant="h3">{formatConsultationReason(consultation) || 'Consulta'}</Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(consultation.startAt)}
            {consultation.specialistName ? ` · ${consultation.specialistName}` : ''}
          </Typography>
        </Box>
      }
    >
      <ConsultationNote consultation={consultation} />
    </SectionCard>
  )
}

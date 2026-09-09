import { Chip, Stack, Typography } from '@mui/material'
import { formatFreeDate } from '@/utils/format-date'
import {
  SYMPTOM_STATUS_COLORS,
  SYMPTOM_STATUS_LABELS,
} from '../../utils/consultation-format'
import { useConsultationSymptomHistory } from '../../hooks/useConsultationDetail'
import { ConsultationHistoryTable } from './ConsultationHistoryTable'

interface SymptomHistoryProps {
  consultationId: number
}

export function SymptomHistory({ consultationId }: SymptomHistoryProps) {
  const { data: history = [] } = useConsultationSymptomHistory(consultationId)

  return (
    <ConsultationHistoryTable
      defaultExpanded
      entries={history.map((entry) => ({
        consultationId: entry.consultationId,
        date: entry.date,
        specialistName: entry.specialistName,
        content: (
          <Stack spacing={0.5}>
            {entry.items.map((item, index) => (
              <Stack
                key={`${entry.consultationId}-${index}`}
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                  {item.name ?? '—'}
                </Typography>
                {item.severityName && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {item.severityName}
                  </Typography>
                )}
                {item.diseaseName && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    · {item.diseaseName}
                  </Typography>
                )}
                {item.onsetDate && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    · inicio {formatFreeDate(item.onsetDate)}
                  </Typography>
                )}
                <Chip
                  size="small"
                  variant="outlined"
                  color={SYMPTOM_STATUS_COLORS[item.status]}
                  label={SYMPTOM_STATUS_LABELS[item.status]}
                />
              </Stack>
            ))}
          </Stack>
        ),
      }))}
    />
  )
}

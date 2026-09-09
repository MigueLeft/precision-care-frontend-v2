import { Chip, Stack, Typography } from '@mui/material'
import {
  DISEASE_STATUS_COLORS,
  DISEASE_STATUS_LABELS,
} from '../../utils/consultation-format'
import { useConsultationDiseaseHistory } from '../../hooks/useConsultationDiseases'
import { ConsultationHistoryTable } from './ConsultationHistoryTable'

interface DiseaseHistoryProps {
  consultationId: number
}

export function DiseaseHistory({ consultationId }: DiseaseHistoryProps) {
  const { data: history = [] } = useConsultationDiseaseHistory(consultationId)

  return (
    <ConsultationHistoryTable
      countLabel={(n) => `${n} ${n === 1 ? 'revisión anterior' : 'revisiones anteriores'}`}
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
                {item.bodySystemName && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {item.bodySystemName}
                  </Typography>
                )}
                <Chip
                  size="small"
                  variant="outlined"
                  color={DISEASE_STATUS_COLORS[item.status]}
                  label={DISEASE_STATUS_LABELS[item.status]}
                />
              </Stack>
            ))}
          </Stack>
        ),
      }))}
    />
  )
}

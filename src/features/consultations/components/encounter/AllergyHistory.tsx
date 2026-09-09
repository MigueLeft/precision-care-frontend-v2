import { Chip, Stack, Typography } from '@mui/material'
import { useConsultationAllergyHistory } from '../../hooks/useConsultationAllergies'
import { ConsultationHistoryTable } from './ConsultationHistoryTable'

interface AllergyHistoryProps {
  consultationId: number
}

export function AllergyHistory({ consultationId }: AllergyHistoryProps) {
  const { data: history = [] } = useConsultationAllergyHistory(consultationId)

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
                {item.typeName && (
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {item.typeName}
                  </Typography>
                )}
                {item.severityName && (
                  <Chip size="small" variant="outlined" label={item.severityName} />
                )}
                {item.reaction && (
                  <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary', width: '100%' }}>
                    {item.reaction}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        ),
      }))}
    />
  )
}

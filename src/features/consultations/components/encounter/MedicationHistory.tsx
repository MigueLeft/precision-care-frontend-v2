import { Chip, Stack, Typography } from '@mui/material'
import {
  ADHERENCE_COLORS,
  ADHERENCE_LABELS,
  RAM_COLORS,
  RAM_LABELS,
} from '../../utils/consultation-format'
import { useConsultationMedicationHistory } from '../../hooks/useConsultationMedications'
import { ConsultationHistoryTable } from './ConsultationHistoryTable'
import type { MedicationHistoryItem } from '../../types'

interface MedicationHistoryProps {
  consultationId: number
}

function medname(item: MedicationHistoryItem) {
  return item.brandName ?? item.genericName ?? 'Medicamento'
}

export function MedicationHistory({ consultationId }: MedicationHistoryProps) {
  const { data: history = [] } = useConsultationMedicationHistory(consultationId)

  return (
    <ConsultationHistoryTable
      entries={history.map((entry) => ({
        consultationId: entry.consultationId,
        date: entry.date,
        specialistName: entry.specialistName,
        content: (
          <Stack spacing={0.75}>
            {entry.items.map((item, index) => (
              <Stack key={`${entry.consultationId}-${index}`} spacing={0.25}>
                <Typography sx={{ fontSize: '13px' }}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {medname(item)}
                  </Typography>
                  {item.dose ? ` ${item.dose}` : ''}
                  {item.frequency ? ` · ${item.frequency}` : ''}
                  {item.discontinuationReason ? ` — ${item.discontinuationReason}` : ''}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                  {item.adherence && (
                    <Chip
                      size="small"
                      variant="outlined"
                      color={ADHERENCE_COLORS[item.adherence]}
                      label={`Adherencia: ${ADHERENCE_LABELS[item.adherence]}`}
                    />
                  )}
                  {item.ramStatus && (
                    <Chip
                      size="small"
                      variant="outlined"
                      color={RAM_COLORS[item.ramStatus]}
                      label={`RAM: ${RAM_LABELS[item.ramStatus]}`}
                    />
                  )}
                </Stack>
                {(item.adherenceNotes || item.ramNotes) && (
                  <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
                    {[item.adherenceNotes, item.ramNotes].filter(Boolean).join(' · ')}
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

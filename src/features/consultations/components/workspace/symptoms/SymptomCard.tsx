import { Chip, Stack, Typography } from '@mui/material'
import { RecordCard } from '@/components/ui/RecordCard'
import { formatFreeDate } from '@/utils/format-date'
import { SYMPTOM_STATUS_COLORS, SYMPTOM_STATUS_LABELS } from '../../../utils/consultation-format'
import type { ConsultationSymptom } from '../../../types'

type SymptomCardProps = {
  symptom: ConsultationSymptom
  selected: boolean
  readOnly: boolean
  onEdit: () => void
  onRemove: () => void
}

// Síntoma en la lista central: severidad, estado, inicio, notas y diagnósticos asociados.
export function SymptomCard({ symptom, selected, readOnly, onEdit, onRemove }: SymptomCardProps) {
  return (
    <RecordCard
      title={symptom.name ?? '—'}
      subtitle={symptom.capturedHere ? null : 'De consulta previa · revisar'}
      selected={selected}
      onEdit={readOnly ? undefined : onEdit}
      onRemove={readOnly ? undefined : onRemove}
      chips={
        <>
          <Chip size="small" color={SYMPTOM_STATUS_COLORS[symptom.status]} label={SYMPTOM_STATUS_LABELS[symptom.status]} />
          {symptom.severityName && <Chip size="small" variant="outlined" label={symptom.severityName} />}
          {symptom.onsetDate && <Chip size="small" variant="outlined" label={`Inicio ${formatFreeDate(symptom.onsetDate)}`} />}
        </>
      }
    >
      {symptom.notes && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 1, whiteSpace: 'pre-line' }}>
          {symptom.notes}
        </Typography>
      )}
      {symptom.diseases.length > 0 && (
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>DIAGNÓSTICOS ASOCIADOS</Typography>
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {symptom.diseases.map((link) => (
              <Chip
                key={link.diseaseCatalogId}
                size="small"
                variant="outlined"
                color={SYMPTOM_STATUS_COLORS[link.status]}
                label={`${link.name ?? '—'}${link.code ? ` (${link.code})` : ''} · ${SYMPTOM_STATUS_LABELS[link.status]}`}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </RecordCard>
  )
}

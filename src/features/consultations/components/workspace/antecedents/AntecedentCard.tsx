import { Chip, Typography } from '@mui/material'
import { RecordCard } from '@/components/ui/RecordCard'
import { formatFreeDate } from '@/utils/format-date'
import { ANTECEDENT_STATUS_COLORS, ANTECEDENT_STATUS_LABELS, ANTECEDENT_TYPE_LABELS, type Antecedent } from '@/features/antecedents'

type AntecedentCardProps = {
  antecedent: Antecedent
  selected: boolean
  readOnly: boolean
  onEdit: () => void
  onRemove: () => void
}

function subtitleOf(antecedent: Antecedent): string | null {
  if (antecedent.type === 'family') return [antecedent.relationship, antecedent.cie10Code].filter(Boolean).join(' · ') || null
  if (antecedent.type === 'surgery' || antecedent.type === 'hospitalization') return ANTECEDENT_TYPE_LABELS[antecedent.type]
  return antecedent.cie10Code
}

// Antecedente familiar, personal o quirúrgico/hospitalización en la lista central.
export function AntecedentCard({ antecedent, selected, readOnly, onEdit, onRemove }: AntecedentCardProps) {
  const date = antecedent.eventDate ?? antecedent.hospitalizationDetail?.admissionDate ?? null
  const complications = antecedent.surgeryDetail?.complications ?? antecedent.hospitalizationDetail?.complications
  const notes = antecedent.description && antecedent.description !== complications ? antecedent.description : null
  const hasChips = !!antecedent.status || !!date

  return (
    <RecordCard
      title={antecedent.name}
      subtitle={subtitleOf(antecedent)}
      selected={selected}
      onEdit={readOnly ? undefined : onEdit}
      onRemove={readOnly ? undefined : onRemove}
      chips={
        hasChips ? (
          <>
            {antecedent.status && antecedent.type !== 'family' && (
              <Chip size="small" color={ANTECEDENT_STATUS_COLORS[antecedent.status]} label={ANTECEDENT_STATUS_LABELS[antecedent.status]} />
            )}
            {date && <Chip size="small" variant="outlined" label={antecedent.type === 'personal' ? `Desde ${formatFreeDate(date)}` : formatFreeDate(date)} />}
          </>
        ) : undefined
      }
    >
      {complications && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 1 }}>Complicaciones: {complications}</Typography>
      )}
      {notes && <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 1, whiteSpace: 'pre-line' }}>{notes}</Typography>}
    </RecordCard>
  )
}

import { Chip, Typography } from '@mui/material'
import { RecordCard } from '@/components/ui/RecordCard'
import { formatFreeDate } from '@/utils/format-date'
import { DISEASE_STATUS_COLORS, DISEASE_STATUS_LABELS } from '../../../utils/consultation-format'
import type { ConsultationDisease } from '../../../types'

type DiseaseCardProps = {
  disease: ConsultationDisease
  // Registrado en una consulta anterior.
  fromPrevious: boolean
  selected: boolean
  readOnly: boolean
  onEdit: () => void
  onRemove: () => void
}

// Diagnóstico en la lista central: código, aparato o sistema, estado, fecha y notas.
export function DiseaseCard({ disease, fromPrevious, selected, readOnly, onEdit, onRemove }: DiseaseCardProps) {
  const subtitle = [disease.code, disease.bodySystemName, disease.isChronic ? 'Crónica' : null].filter(Boolean).join(' · ')
  return (
    <RecordCard
      title={disease.name ?? '—'}
      subtitle={subtitle || null}
      selected={selected}
      onEdit={readOnly ? undefined : onEdit}
      onRemove={readOnly ? undefined : onRemove}
      chips={
        <>
          <Chip size="small" color={DISEASE_STATUS_COLORS[disease.status]} label={DISEASE_STATUS_LABELS[disease.status]} />
          {disease.dxDate && <Chip size="small" variant="outlined" label={`Dx ${formatFreeDate(disease.dxDate)}`} />}
          {fromPrevious && <Chip size="small" variant="outlined" label="De consulta previa" />}
        </>
      }
    >
      {disease.notes && (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 1, whiteSpace: 'pre-line' }}>
          {disease.notes}
        </Typography>
      )}
    </RecordCard>
  )
}

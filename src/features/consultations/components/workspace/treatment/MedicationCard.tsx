import { Chip, Typography } from '@mui/material'
import { RecordCard } from '@/components/ui/RecordCard'
import { ADHERENCE_COLORS, ADHERENCE_LABELS, TOLERANCE_COLORS, TOLERANCE_LABELS } from '../../../utils/consultation-format'
import { medicationName } from './medication-name'
import type { ConsultationMedication } from '../../../types'

type MedicationCardProps = {
  medication: ConsultationMedication
  selected: boolean
  readOnly: boolean
  onEdit: () => void
  onRemove: () => void
}

// Medicamento del tratamiento en la lista central: dosis, frecuencia,
// adherencia y tolerancia capturadas, o si ya se finalizó.
export function MedicationCard({ medication, selected, readOnly, onEdit, onRemove }: MedicationCardProps) {
  const finished = medication.status === 'previous'
  const doseLine = [medication.dose, medication.frequency].filter(Boolean).join(' · ')
  const notes = [medication.adherenceNotes, medication.ramNotes].filter(Boolean).join(' · ')

  return (
    <RecordCard
      title={medicationName(medication)}
      subtitle={[medication.genericName !== medication.brandName ? medication.genericName : null, doseLine || null].filter(Boolean).join(' · ') || null}
      selected={selected}
      highlight={finished ? 'error' : undefined}
      onEdit={readOnly || finished ? undefined : onEdit}
      onRemove={readOnly ? undefined : onRemove}
      chips={
        <>
          {finished && (
            <Chip size="small" color="error" label={`Finalizado${medication.discontinuationReason ? ` · ${medication.discontinuationReason}` : ''}`} />
          )}
          {medication.adherence && (
            <Chip size="small" color={ADHERENCE_COLORS[medication.adherence]} label={`Adherencia: ${ADHERENCE_LABELS[medication.adherence]}`} />
          )}
          {medication.ramStatus && (
            <Chip size="small" color={TOLERANCE_COLORS[medication.ramStatus]} label={`Tolerancia: ${TOLERANCE_LABELS[medication.ramStatus]}`} />
          )}
          {!finished && !medication.adherence && !medication.ramStatus && (
            <Chip size="small" variant="outlined" label="Sin revisar en esta consulta" />
          )}
        </>
      }
    >
      {notes && <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>{notes}</Typography>}
    </RecordCard>
  )
}

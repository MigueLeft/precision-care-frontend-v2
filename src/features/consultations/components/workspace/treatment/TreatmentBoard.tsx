import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useConsultationMedications, useRemoveConsultationMedication } from '../../../hooks/useConsultationMedications'
import { MedicationHistory } from '../../encounter/MedicationHistory'
import { BoardEmpty, BoardHeader } from '../BoardHeader'
import { useEncounterWorkspace } from '../workspace-context'
import { MedicationCard } from './MedicationCard'
import { medicationName } from './medication-name'
import type { ConsultationMedication } from '../../../types'

type TreatmentBoardProps = {
  consultationId: number
  readOnly: boolean
}

// Lista central del tratamiento del paciente. Se agrega y se edita (dosis,
// adherencia, tolerancia, reemplazo o fin del tratamiento) en el panel derecho.
export function TreatmentBoard({ consultationId, readOnly }: TreatmentBoardProps) {
  const { data: medications = [] } = useConsultationMedications(consultationId)
  const removeMutation = useRemoveConsultationMedication(consultationId)
  const { editing, startEdit, clearEdit } = useEncounterWorkspace()
  const [removing, setRemoving] = useState<ConsultationMedication | null>(null)
  const isEditing = (id: number) => editing?.kind === 'medication' && editing.id === id

  function confirmRemove() {
    if (!removing) return
    const id = removing.id
    removeMutation.mutate(id, {
      onSuccess: () => {
        if (isEditing(id)) clearEdit()
        setRemoving(null)
      },
    })
  }

  return (
    <div>
      <BoardHeader title="Tratamiento" meta={`${medications.length} registrados`} />
      {medications.length === 0 ? (
        <BoardEmpty>Sin medicamentos registrados. Búscalos en el panel de la derecha.</BoardEmpty>
      ) : (
        <Stack spacing={1}>
          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              readOnly={readOnly}
              selected={isEditing(medication.id)}
              onEdit={() => startEdit({ kind: 'medication', id: medication.id })}
              onRemove={() => setRemoving(medication)}
            />
          ))}
        </Stack>
      )}
      <Stack sx={{ mt: 2 }}>
        <MedicationHistory consultationId={consultationId} />
      </Stack>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Los medicamentos se guardan en el expediente, no como prescripción de esta consulta.
      </Typography>

      <ConfirmDialog
        open={removing !== null}
        title="Quitar medicamento"
        description={`¿Quitar ${removing ? medicationName(removing) : ''} del expediente del paciente? Úsalo solo si se registró por error; para dejar de tomarlo, edítalo y finaliza el tratamiento.`}
        confirmLabel="Quitar"
        isConfirming={removeMutation.isPending}
        onConfirm={confirmRemove}
        onClose={() => setRemoving(null)}
      />
    </div>
  )
}

import { Stack } from '@mui/material'
import { toast } from '@/utils/toast'
import { useConsultationSymptoms, useRemoveConsultationSymptom } from '../../../hooks/useConsultationDetail'
import { SymptomHistory } from '../../encounter/SymptomHistory'
import { BoardEmpty, BoardHeader } from '../BoardHeader'
import { useEncounterWorkspace } from '../workspace-context'
import { SymptomCard } from './SymptomCard'

type SymptomsBoardProps = {
  consultationId: number
  readOnly: boolean
}

// Lista central de síntomas: los de esta consulta y los no resueltos que se
// traen de la anterior para revisar. Editar abre el síntoma en el panel derecho.
export function SymptomsBoard({ consultationId, readOnly }: SymptomsBoardProps) {
  const { data: symptoms = [] } = useConsultationSymptoms(consultationId)
  const removeMutation = useRemoveConsultationSymptom(consultationId)
  const { editing, startEdit, clearEdit } = useEncounterWorkspace()

  function remove(symptomId: number) {
    removeMutation.mutate(symptomId, {
      onSuccess: () => {
        toast.success('Síntoma quitado de la consulta')
        if (editing?.kind === 'symptom' && editing.id === symptomId) clearEdit()
      },
    })
  }

  return (
    <div>
      <BoardHeader title="Síntomas" meta={`${symptoms.length} en seguimiento`} />
      {symptoms.length === 0 ? (
        <BoardEmpty>Sin síntomas registrados. Búscalos en el panel de la derecha.</BoardEmpty>
      ) : (
        <Stack spacing={1}>
          {symptoms.map((symptom) => (
            <SymptomCard
              key={symptom.id}
              symptom={symptom}
              readOnly={readOnly}
              selected={editing?.kind === 'symptom' && editing.id === symptom.id}
              onEdit={() => startEdit({ kind: 'symptom', id: symptom.id })}
              onRemove={() => remove(symptom.id)}
            />
          ))}
        </Stack>
      )}
      <Stack sx={{ mt: 2 }}>
        <SymptomHistory consultationId={consultationId} />
      </Stack>
    </div>
  )
}

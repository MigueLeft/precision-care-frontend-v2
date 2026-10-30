import { Stack } from '@mui/material'
import { useConsultationDiseases, useRemoveConsultationDisease } from '../../../hooks/useConsultationDiseases'
import { DiseaseHistory } from '../../encounter/DiseaseHistory'
import { BoardEmpty, BoardHeader } from '../BoardHeader'
import { useEncounterWorkspace } from '../workspace-context'
import { DiseaseCard } from './DiseaseCard'

type DiseasesBoardProps = {
  consultationId: number
  readOnly: boolean
}

// Lista central de diagnósticos del paciente en la consulta.
export function DiseasesBoard({ consultationId, readOnly }: DiseasesBoardProps) {
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const removeMutation = useRemoveConsultationDisease(consultationId)
  const { editing, startEdit, clearEdit } = useEncounterWorkspace()

  function remove(diseaseId: number) {
    removeMutation.mutate(diseaseId, {
      onSuccess: () => {
        if (editing?.kind === 'disease' && editing.id === diseaseId) clearEdit()
      },
    })
  }

  return (
    <div>
      <BoardHeader title="Diagnósticos" meta={`${diseases.length} registrados`} />
      {diseases.length === 0 ? (
        <BoardEmpty>Sin diagnósticos registrados. Búscalos en el panel de la derecha.</BoardEmpty>
      ) : (
        <Stack spacing={1}>
          {diseases.map((disease) => (
            <DiseaseCard
              key={disease.id}
              disease={disease}
              fromPrevious={disease.consultationId != null && disease.consultationId !== consultationId}
              readOnly={readOnly}
              selected={editing?.kind === 'disease' && editing.id === disease.id}
              onEdit={() => startEdit({ kind: 'disease', id: disease.id })}
              onRemove={() => remove(disease.id)}
            />
          ))}
        </Stack>
      )}
      <Stack sx={{ mt: 2 }}>
        <DiseaseHistory consultationId={consultationId} />
      </Stack>
    </div>
  )
}

import { useConsultationSymptoms } from '../../../hooks/useConsultationDetail'
import { useEncounterWorkspace } from '../workspace-context'
import { SymptomCaptureForm } from './SymptomCaptureForm'

// Panel derecho de Síntomas: registro nuevo o el síntoma elegido en la lista.
export function SymptomCapturePanel({ consultationId }: { consultationId: number }) {
  const { editing } = useEncounterWorkspace()
  const { data: symptoms = [] } = useConsultationSymptoms(consultationId)
  const symptom = editing?.kind === 'symptom' ? (symptoms.find((item) => item.id === editing.id) ?? null) : null

  return (
    <SymptomCaptureForm
      key={symptom?.id ?? 'new'}
      consultationId={consultationId}
      current={symptoms}
      symptom={symptom}
    />
  )
}

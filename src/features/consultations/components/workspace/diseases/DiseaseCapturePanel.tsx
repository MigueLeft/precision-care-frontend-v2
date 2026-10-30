import { useConsultationDiseases } from '../../../hooks/useConsultationDiseases'
import { useEncounterWorkspace } from '../workspace-context'
import { DiseaseCaptureForm } from './DiseaseCaptureForm'

// Panel derecho de Diagnósticos: registro nuevo o el diagnóstico elegido en la lista.
export function DiseaseCapturePanel({ consultationId }: { consultationId: number }) {
  const { editing } = useEncounterWorkspace()
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const disease = editing?.kind === 'disease' ? (diseases.find((item) => item.id === editing.id) ?? null) : null

  return <DiseaseCaptureForm key={disease?.id ?? 'new'} consultationId={consultationId} current={diseases} disease={disease} />
}

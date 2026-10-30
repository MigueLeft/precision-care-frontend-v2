import { useConsultationMedications } from '../../../hooks/useConsultationMedications'
import { useEncounterWorkspace } from '../workspace-context'
import { MedicationAddForm } from './MedicationAddForm'
import { MedicationEditForm } from './MedicationEditForm'

// Panel derecho de Tratamiento: alta de un medicamento o revisión del elegido en la lista.
export function MedicationCapturePanel({ consultationId }: { consultationId: number }) {
  const { editing } = useEncounterWorkspace()
  const { data: medications = [] } = useConsultationMedications(consultationId)
  const medication =
    editing?.kind === 'medication' ? medications.find((item) => item.id === editing.id && item.status === 'current') : undefined

  return medication ? (
    <MedicationEditForm key={medication.id} consultationId={consultationId} medication={medication} />
  ) : (
    <MedicationAddForm consultationId={consultationId} />
  )
}

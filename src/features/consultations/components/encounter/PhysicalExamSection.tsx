import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { useAnthropometryByConsultation } from '@/features/anthropometry'
import { usePatient } from '@/features/patients'
import { alteredVitals, PhysicalExamForm, type PhysicalExam } from '@/features/physical-exam'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import type { Consultation } from '../../types'

interface PhysicalExamSectionProps {
  index: number
  consultation: Consultation
  readOnly: boolean
}

// Examen físico de la consulta (consultation.physical_exam), con autoguardado.
// Los signos vitales alterados de Antropometría marcan Estado general como anormal.
export function PhysicalExamSection({ index, consultation, readOnly }: PhysicalExamSectionProps) {
  const anthropometry = useAnthropometryByConsultation(consultation.id)
  const patient = usePatient(consultation.patientId)
  const update = useUpdateConsultation(consultation.id)
  const save = useDebouncedCallback((next: PhysicalExam) => {
    update.mutate({ physicalExam: next })
  }, 700)

  const vitals = alteredVitals(anthropometry.data ?? null)
  const ready = anthropometry.isSuccess && patient.isSuccess

  return (
    <CollapsibleSection title={`${index}. Examen físico`} defaultExpanded>
      {ready && (
        <PhysicalExamForm
          // Se remonta si cambian los vitales para reaplicar la regla.
          key={vitals.map((v) => v.label).join(',')}
          saved={consultation.physicalExam}
          sex={patient.data?.sex ?? null}
          alteredVitals={vitals}
          readOnly={readOnly}
          onChange={save}
        />
      )}
    </CollapsibleSection>
  )
}

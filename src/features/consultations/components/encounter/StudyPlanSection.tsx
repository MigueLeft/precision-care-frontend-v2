import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { AutosaveTextField } from './AutosaveTextField'
import type { Consultation } from '../../types'

type StudyPlanSectionProps = {
  index: number
  consultation: Consultation
  readOnly: boolean
}

// Plan de estudio del Cierre Clínico: nota de texto libre (consultation.diagnosticPlan).
export function StudyPlanSection({ index, consultation, readOnly }: StudyPlanSectionProps) {
  const update = useUpdateConsultation(consultation.id)

  return (
    <CollapsibleSection title={`${index}. Plan de estudio`} defaultExpanded>
      <AutosaveTextField
        placeholder="Estudios, interconsultas y seguimiento a solicitar…"
        value={consultation.diagnosticPlan ?? ''}
        onSave={(diagnosticPlan) => update.mutate({ diagnosticPlan })}
        disabled={readOnly}
        minRows={4}
      />
    </CollapsibleSection>
  )
}

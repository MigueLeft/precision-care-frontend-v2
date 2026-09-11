import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import {
  useLifestyleByPatient,
  LifeEssential8Card,
  LifeEssential8Empty,
} from '@/features/lifestyle'

interface LifeEssential8SectionProps {
  index: number
  patientId: number
}

// Sólo lectura: la captura del cuestionario de estilo de vida vive en su propio
// flujo; aquí se muestra la última evaluación disponible del paciente.
export function LifeEssential8Section({ index, patientId }: LifeEssential8SectionProps) {
  const { data: evaluations = [], isLoading, isError, error } = useLifestyleByPatient(patientId)
  const latest = evaluations[0]

  return (
    <CollapsibleSection title={`${index}. Life's Essential 8`} defaultExpanded>
      {isLoading || isError ? (
        <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
          {null}
        </QueryBoundary>
      ) : latest ? (
        <LifeEssential8Card assessment={latest} />
      ) : (
        <LifeEssential8Empty />
      )}
    </CollapsibleSection>
  )
}

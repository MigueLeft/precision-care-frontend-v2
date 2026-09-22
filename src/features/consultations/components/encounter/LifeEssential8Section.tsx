import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useIntakeResponsesByPatient, useIntakeResponseDetail } from '@/features/intake-responses'
import {
  useLifestyleByPatient,
  LifeEssential8Card,
  LifeEssential8Empty,
  ClinicalRiskScoresCard,
} from '@/features/lifestyle'

interface LifeEssential8SectionProps {
  index: number
  patientId: number
}

// Sólo lectura: la captura del ingresable de estilo de vida vive en su propio
// flujo (ver "Enviar ingresable" en la pestaña Ingresables del expediente);
// aquí se muestra la última evaluación disponible del paciente, junto con el
// resto de los scores del IM1 que no son uno de los 8 componentes de Life's
// Essential 8 (educación, nivel socioeconómico, antecedentes familiares,
// apnea del sueño, ansiedad, depresión, alcohol, tabaquismo, drogas...).
// Sin una captura real (IM1 completado), no se muestra nada — nunca datos de ejemplo.
export function LifeEssential8Section({ index, patientId }: LifeEssential8SectionProps) {
  const { data: evaluations = [], isLoading, isError, error } = useLifestyleByPatient(patientId)
  const latest = evaluations[0]

  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const latestCompletedResponse = responses.find((r) => r.completed)
  const { data: responseDetail } = useIntakeResponseDetail(latestCompletedResponse?.id ?? null)
  const clinicalScores = (responseDetail?.results ?? []).filter(
    (r) => r.destinationType === 'custom' && r.destinationField,
  )

  return (
    <CollapsibleSection title={`${index}. Estilo de vida`} defaultExpanded>
      {isLoading || isError ? (
        <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
          {null}
        </QueryBoundary>
      ) : (
        <>
          {latest ? <LifeEssential8Card assessment={latest} /> : <LifeEssential8Empty />}
          <ClinicalRiskScoresCard
            scores={clinicalScores.map((r) => ({
              name: r.name,
              destinationField: r.destinationField as string,
              score: r.score,
              interpretation: r.interpretation,
            }))}
          />
        </>
      )}
    </CollapsibleSection>
  )
}

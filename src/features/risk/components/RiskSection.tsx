import { Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewRisk, useMe } from '@/features/identity'
import { useConfirmRiskFactors, useRiskOverview } from '../hooks/useRisk'
import { RiskFactorsForm } from './RiskFactorsForm'
import { RiskOverviewContent } from './RiskOverviewContent'

type RiskSectionProps = {
  index: number
  patientId: number
  consultationId: number
  readOnly: boolean
}

// Sección de la consulta: confirmación de factores y scores de riesgo.
export function RiskSection(props: RiskSectionProps) {
  const { data: me } = useMe()
  if (!canViewRisk(me)) return null
  return <RiskSectionContent {...props} canEdit={!!me?.permissions.includes('riesgo:create')} />
}

function RiskSectionContent({ index, patientId, consultationId, readOnly, canEdit }: RiskSectionProps & { canEdit: boolean }) {
  const { data, isLoading, isError, error } = useRiskOverview(patientId)
  const confirm = useConfirmRiskFactors(patientId, consultationId)
  const locked = readOnly || !canEdit

  return (
    <CollapsibleSection title={`${index}. Riesgo cardiometabólico`} defaultExpanded>
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {data && (
          <RiskOverviewContent overview={data} patientId={patientId} consultationId={consultationId} readOnly={locked}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Datos para el cálculo</Typography>
            <RiskFactorsForm
              profile={data.profile}
              readOnly={locked}
              saving={confirm.isPending}
              onSubmit={(answers) => confirm.mutate(answers)}
            />
          </RiskOverviewContent>
        )}
      </QueryBoundary>
    </CollapsibleSection>
  )
}

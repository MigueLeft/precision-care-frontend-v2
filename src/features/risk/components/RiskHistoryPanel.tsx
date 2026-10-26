import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { canViewRisk, useMe } from '@/features/identity'
import { useRiskOverview } from '../hooks/useRisk'
import { RiskOverviewContent } from './RiskOverviewContent'

// Pestaña "Riesgo" del expediente: resultados vigentes. El histórico está en su
// propia pestaña ("Histórico de riesgo").
export function RiskHistoryPanel({ patientId }: { patientId: number }) {
  const { data: me } = useMe()
  if (!canViewRisk(me)) return <EmptyState message="No tienes permiso para ver los scores de riesgo." />
  return <CurrentRisk patientId={patientId} />
}

function CurrentRisk({ patientId }: { patientId: number }) {
  const overview = useRiskOverview(patientId)
  return (
    <QueryBoundary isLoading={overview.isLoading} isError={overview.isError} error={overview.error}>
      {overview.data && <RiskOverviewContent overview={overview.data} consultationId={null} readOnly />}
    </QueryBoundary>
  )
}

import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import {
  ANTHROPOMETRY_REPORT_LABELS,
  useAnthropometryByConsultation,
  useAnthropometryReports,
} from '@/features/anthropometry'
import { DeliverableActionCard } from './DeliverableActionCard'

type AnthropometryReportCardsProps = {
  consultationId: number
  patientId: number
}

// Reportes impresos de la antropometría registrada en esta consulta.
export function AnthropometryReportCards({ consultationId, patientId }: AnthropometryReportCardsProps) {
  const { data: anthropometry } = useAnthropometryByConsultation(consultationId)
  const { print, ready } = useAnthropometryReports(patientId)
  const missing = !anthropometry
  const subtitle = (text: string) => (missing ? 'Registra la antropometría de esta consulta' : text)

  return (
    <>
      <DeliverableActionCard
        icon={AccessibilityNewOutlinedIcon}
        title={ANTHROPOMETRY_REPORT_LABELS.body_composition}
        subtitle={subtitle('Grasa y músculo por segmento con la silueta')}
        disabled={missing || !ready}
        onClick={() => anthropometry && print('body_composition', anthropometry)}
      />
      <DeliverableActionCard
        icon={MonitorHeartOutlinedIcon}
        title={ANTHROPOMETRY_REPORT_LABELS.anthropometry}
        subtitle={subtitle('Signos vitales y medidas con referencias')}
        disabled={missing || !ready}
        onClick={() => anthropometry && print('anthropometry', anthropometry)}
      />
    </>
  )
}

import { Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  useAnthropometriesByPatient,
  useAnthropometryByConsultation,
  useSaveAnthropometry,
} from '../hooks/useAnthropometry'
import { sortAnthropometries } from '../utils/anthropometry-calculations'
import { historyColumns } from '../utils/history-columns'
import { AnthropometryForm } from './AnthropometryForm'

type AnthropometrySectionProps = {
  index: number
  consultationId: number
  patientId: number
  consultationDate: string
  readOnly: boolean
}

// Antropometría dentro de la consulta: hoja de captura con las últimas tres
// mediciones a la izquierda (de la más vieja a la más nueva) y esta consulta.
export function AnthropometrySection({
  index,
  consultationId,
  patientId,
  consultationDate,
  readOnly,
}: AnthropometrySectionProps) {
  const { data: all = [] } = useAnthropometriesByPatient(patientId, consultationId)
  const { data: existing, isLoading } = useAnthropometryByConsultation(consultationId)
  const save = useSaveAnthropometry(existing?.id)

  const history = sortAnthropometries(all.filter((row) => row.consultationId !== consultationId))

  return (
    <CollapsibleSection title={`${index}. Antropometría`} defaultExpanded>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
        <Typography component="span" sx={{ fontSize: '11px', fontWeight: 400, color: 'text.secondary', ml: 1 }}>
          Enter o ↓ pasa al siguiente valor
        </Typography>
      </Typography>

      {!isLoading && (
        <AnthropometryForm
          key={existing?.id ?? 'new'}
          patientId={patientId}
          consultationId={consultationId}
          existing={existing}
          history={historyColumns(history)}
          readOnly={readOnly}
          isSaving={save.isPending}
          onSave={save.mutate}
        />
      )}
    </CollapsibleSection>
  )
}

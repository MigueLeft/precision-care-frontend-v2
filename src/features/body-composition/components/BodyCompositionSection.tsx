import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  useBodyCompositionsByPatient,
  useBodyCompositionByConsultation,
  useSaveBodyComposition,
} from '../hooks/useBodyComposition'
import { BodyCompositionHistoryTable } from './BodyCompositionHistoryTable'
import { BodyCompositionForm } from './BodyCompositionForm'

interface BodyCompositionSectionProps {
  index: number
  consultationId: number
  patientId: number
  consultationDate: string
  readOnly: boolean
}

export function BodyCompositionSection({
  index,
  consultationId,
  patientId,
  consultationDate,
  readOnly,
}: BodyCompositionSectionProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const { data: all = [] } = useBodyCompositionsByPatient(patientId)
  const { data: existing } = useBodyCompositionByConsultation(consultationId)
  const save = useSaveBodyComposition(existing?.id ?? undefined)

  const history = all.filter((c) => c.consultationId !== consultationId).slice(0, 3)

  return (
    <CollapsibleSection title={`${index}. Composición corporal`} defaultExpanded>
      {history.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary' }}>
              Histórico · {history.length}{' '}
              {history.length === 1 ? 'medición anterior' : 'mediciones anteriores'}
            </Typography>
            <Typography
              onClick={() => setHistoryOpen((prev) => !prev)}
              sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
            >
              {historyOpen ? 'Ocultar' : 'Ver'}
            </Typography>
          </Stack>
          {historyOpen && <BodyCompositionHistoryTable compositions={history} />}
        </Box>
      )}

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      {readOnly ? (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
          Consulta terminada — la medición ya no se puede editar.
        </Typography>
      ) : (
        <BodyCompositionForm
          key={existing?.id ?? 'new'}
          patientId={patientId}
          consultationId={consultationId}
          existing={existing}
          isSaving={save.isPending}
          onSave={save.mutate}
        />
      )}
    </CollapsibleSection>
  )
}

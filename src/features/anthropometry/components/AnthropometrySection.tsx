import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  useAnthropometriesByPatient,
  useAnthropometryByConsultation,
  useSaveAnthropometry,
} from '../hooks/useAnthropometry'
import { anthropometryValues, sortAnthropometries } from '../utils/anthropometry-calculations'
import { AnthropometryHistoryTable } from './AnthropometryHistoryTable'
import { AnthropometryForm } from './AnthropometryForm'

type AnthropometrySectionProps = {
  index: number
  consultationId: number
  patientId: number
  consultationDate: string
  readOnly: boolean
}

// Antropometría dentro de la consulta: histórico reciente y captura de la consulta.
export function AnthropometrySection({
  index,
  consultationId,
  patientId,
  consultationDate,
  readOnly,
}: AnthropometrySectionProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const { data: all = [] } = useAnthropometriesByPatient(patientId, consultationId)
  const { data: existing, isLoading } = useAnthropometryByConsultation(consultationId)
  const save = useSaveAnthropometry(existing?.id)

  const history = sortAnthropometries(all.filter((row) => row.consultationId !== consultationId))
  const recent = history.slice(0, 3)

  return (
    <CollapsibleSection title={`${index}. Antropometría`} defaultExpanded>
      {recent.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary' }}>
              Histórico · {recent.length}{' '}
              {recent.length === 1 ? 'medición anterior' : 'mediciones anteriores'}
            </Typography>
            <Typography
              onClick={() => setHistoryOpen((prev) => !prev)}
              sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
            >
              {historyOpen ? 'Ocultar' : 'Ver'}
            </Typography>
          </Stack>
          {historyOpen && <AnthropometryHistoryTable rows={recent} />}
        </Box>
      )}

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1.5 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      {!isLoading && (
        <AnthropometryForm
          key={existing?.id ?? 'new'}
          patientId={patientId}
          consultationId={consultationId}
          existing={existing}
          previous={history[0] ? anthropometryValues(history[0]) : undefined}
          readOnly={readOnly}
          isSaving={save.isPending}
          onSave={save.mutate}
        />
      )}
    </CollapsibleSection>
  )
}

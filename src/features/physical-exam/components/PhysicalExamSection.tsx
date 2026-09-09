import { Box, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  usePhysicalExamByConsultation,
  usePhysicalExamsByPatient,
  useSavePhysicalExam,
} from '../hooks/usePhysicalExams'
import { PhysicalExamHistoryTable } from './PhysicalExamHistoryTable'
import { PhysicalExamCaptureForm } from './PhysicalExamCaptureForm'

interface PhysicalExamSectionProps {
  index: number
  consultationId: number
  patientId: number
  consultationDate: string
  readOnly: boolean
}

export function PhysicalExamSection({
  index,
  consultationId,
  patientId,
  consultationDate,
  readOnly,
}: PhysicalExamSectionProps) {
  const { data: exams = [] } = usePhysicalExamsByPatient(patientId)
  const { data: existing, isLoading } = usePhysicalExamByConsultation(consultationId)
  const save = useSavePhysicalExam(existing?.id)

  const history = exams.filter((exam) => exam.consultationId !== consultationId)
  const previous = history[0]

  return (
    <CollapsibleSection title={`${index}. Examen físico`} defaultExpanded>
      {history.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
            Histórico · {history.length}{' '}
            {history.length === 1 ? 'examen anterior' : 'exámenes anteriores'}
          </Typography>
          <PhysicalExamHistoryTable exams={history.slice(0, 3)} />
        </Box>
      )}

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      {!isLoading && (
        <PhysicalExamCaptureForm
          key={existing?.id ?? 'new'}
          patientId={patientId}
          consultationId={consultationId}
          existing={existing ?? null}
          previous={previous}
          readOnly={readOnly}
          isSaving={save.isPending}
          onSave={save.mutate}
        />
      )}
    </CollapsibleSection>
  )
}

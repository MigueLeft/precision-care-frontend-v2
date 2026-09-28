import { Stack, Typography } from '@mui/material'
import { useBodyCompositionByConsultation } from '@/features/body-composition'
import { usePhysicalExamByConsultation } from '@/features/physical-exam'
import { formatNumber } from '@/utils/parse-numeric'
import {
  BODY_COMPOSITION_PARAMS,
  PHYSICAL_PARAMS,
  bodyCompositionSnapshot,
  measurementValues,
  physicalExamSnapshot,
  type MeasurementValue,
} from '../../utils/measurement-snapshots'
import { NoteBlock, NoteEmpty } from './NoteBlock'

function ValueList({ values }: { values: MeasurementValue[] }) {
  if (values.length === 0) return <NoteEmpty />
  return (
    <Typography sx={{ fontSize: '13px' }}>
      {values.map((item, index) => (
        <span key={item.key}>
          {index > 0 && ' · '}
          {item.label} <strong>{formatNumber(item.value)}</strong> {item.unit}
        </span>
      ))}
    </Typography>
  )
}

// Examen físico y composición corporal registrados en la consulta.
export function NoteMeasurements({ consultationId }: { consultationId: number }) {
  const { data: exam } = usePhysicalExamByConsultation(consultationId)
  const { data: composition } = useBodyCompositionByConsultation(consultationId)

  const examValues = exam ? measurementValues(PHYSICAL_PARAMS, physicalExamSnapshot(exam.measurements)) : []
  const compositionValues = composition
    ? measurementValues(BODY_COMPOSITION_PARAMS, bodyCompositionSnapshot(composition))
    : []

  return (
    <Stack spacing={2.5}>
      <NoteBlock title="EXAMEN FÍSICO">
        <ValueList values={examValues} />
      </NoteBlock>
      <NoteBlock title="COMPOSICIÓN CORPORAL">
        <ValueList values={compositionValues} />
      </NoteBlock>
    </Stack>
  )
}

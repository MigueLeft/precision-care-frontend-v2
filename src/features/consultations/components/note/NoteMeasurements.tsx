import { Divider, Stack, Typography } from '@mui/material'
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

// Un valor por renglón: etiqueta a la izquierda, valor y unidad a la derecha.
function ValueList({ values }: { values: MeasurementValue[] }) {
  if (values.length === 0) return <NoteEmpty />
  return (
    <Stack divider={<Divider flexItem />} sx={{ maxWidth: 480 }}>
      {values.map((item) => (
        <Stack
          key={item.key}
          direction="row"
          spacing={2}
          sx={{ py: 0.5, justifyContent: 'space-between', alignItems: 'baseline' }}
        >
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{item.label}</Typography>
          <Typography sx={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
            <strong>{formatNumber(item.value)}</strong> {item.unit}
          </Typography>
        </Stack>
      ))}
    </Stack>
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

import { Divider, Stack, Typography } from '@mui/material'
import { anthropometryValues, useAnthropometryByConsultation } from '@/features/anthropometry'
import { formatNumber } from '@/utils/parse-numeric'
import {
  MEASUREMENT_PARAMS,
  measurementValues,
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
            <strong>{formatNumber(item.value, item.decimals)}</strong> {item.unit}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

// Antropometría registrada en la consulta.
export function NoteMeasurements({ consultationId }: { consultationId: number }) {
  const { data: anthropometry } = useAnthropometryByConsultation(consultationId)
  const snapshot = Object.fromEntries(
    Object.entries(anthropometryValues(anthropometry)).map(([key, value]) => [key, value ?? null]),
  )

  return (
    <NoteBlock title="ANTROPOMETRÍA">
      <ValueList values={measurementValues(MEASUREMENT_PARAMS, snapshot)} />
    </NoteBlock>
  )
}

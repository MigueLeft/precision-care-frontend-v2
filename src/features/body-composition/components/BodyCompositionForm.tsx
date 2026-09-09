import { useMemo, useState } from 'react'
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { todayIsoDate } from '@/utils/format-date'
import {
  GENERAL_PARAMS,
  SEGMENTS,
  SEGMENT_LABELS,
  SEGMENT_PARAMS,
  computeBmi,
  fatToLose,
  segmentSkeletalKg,
} from '../config'
import { getSegment } from '../utils/body-composition-helpers'
import type { BodyComposition, SaveBodyCompositionInput, SegmentInput } from '../types'

interface BodyCompositionFormProps {
  patientId: number
  consultationId?: number
  existing?: BodyComposition | null
  isSaving: boolean
  onSave: (input: SaveBodyCompositionInput) => void
  onCancel?: () => void
}

type State = Record<string, string>

function initialState(existing?: BodyComposition | null): State {
  const state: State = {}
  if (!existing) return state
  for (const key of [
    'weightKg',
    'heightCm',
    'basalMetabolismKcal',
    'totalWaterKg',
    'idealWeightKg',
    'idealFatMassKg',
  ]) {
    const value = (existing as unknown as Record<string, string | null>)[key]
    if (value != null) state[key] = value
  }
  for (const segment of [...SEGMENTS, 'total'] as const) {
    const seg = getSegment(existing, segment)
    if (!seg) continue
    for (const param of SEGMENT_PARAMS) {
      const value = (seg as unknown as Record<string, string | null>)[param.key]
      if (value != null) state[`${segment}.${param.key}`] = value
    }
    if (seg.fatMassPct != null) state[`${segment}.fatMassPct`] = seg.fatMassPct
  }
  return state
}

const n = (s: string | undefined) => (s !== undefined && s !== '' ? Number(s) : undefined)

export function BodyCompositionForm({
  patientId,
  consultationId,
  existing,
  isSaving,
  onSave,
  onCancel,
}: BodyCompositionFormProps) {
  const [values, setValues] = useState<State>(() => initialState(existing))
  const [date, setDate] = useState(
    existing?.assessmentDate ? existing.assessmentDate.slice(0, 10) : todayIsoDate(),
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }))

  const weight = n(values.weightKg)
  const height = n(values.heightCm)
  const totalFatPct = n(values['total.fatMassPct'])

  const derived = useMemo(() => {
    const bmi = computeBmi(weight, height)
    const totalFatKg =
      weight !== undefined && totalFatPct !== undefined
        ? Number(((weight * totalFatPct) / 100).toFixed(1))
        : undefined
    const totalLeanKg =
      weight !== undefined && totalFatKg !== undefined
        ? Number((weight - totalFatKg).toFixed(1))
        : undefined
    return { bmi, totalFatKg, totalLeanKg }
  }, [weight, height, totalFatPct])

  const idealFatKg = n(values.idealFatMassKg)
  const grasaAPerder = fatToLose(derived.totalFatKg, idealFatKg)

  function generalDisplay(key: string): string {
    if (key === 'bmi') return derived.bmi?.toString() ?? '—'
    if (key === 'totalFatKg') return derived.totalFatKg?.toString() ?? '—'
    if (key === 'totalLeanKg') return derived.totalLeanKg?.toString() ?? '—'
    return values[key] ?? ''
  }

  function segmentSkeletal(segment: string): number | undefined {
    return segmentSkeletalKg(n(values[`${segment}.leanMassKg`]))
  }

  function buildSegments(): SegmentInput[] {
    const out: SegmentInput[] = []
    const total: SegmentInput = {
      segment: 'total',
      fatMassPct: totalFatPct,
      fatMassKg: derived.totalFatKg,
      leanMassKg: derived.totalLeanKg,
    }
    if (total.fatMassPct !== undefined || total.leanMassKg !== undefined) out.push(total)

    for (const segment of SEGMENTS) {
      const seg: Record<string, unknown> = { segment }
      let has = false
      for (const param of SEGMENT_PARAMS) {
        if (param.calc) continue
        const value = n(values[`${segment}.${param.key}`])
        if (value !== undefined) {
          seg[param.key] = value
          has = true
        }
      }
      const skeletal = segmentSkeletal(segment)
      if (skeletal !== undefined) seg.skeletalMuscleMassKg = skeletal
      if (has || skeletal !== undefined) out.push(seg as unknown as SegmentInput)
    }
    return out
  }

  function handleSave() {
    onSave({
      patientId,
      consultationId,
      assessmentDate: date,
      weightKg: weight,
      heightCm: height,
      bmi: derived.bmi,
      basalMetabolismKcal: n(values.basalMetabolismKcal),
      totalWaterKg: n(values.totalWaterKg),
      idealWeightKg: n(values.idealWeightKg),
      idealFatMassKg: idealFatKg,
      notes: notes.trim() || undefined,
      segments: buildSegments(),
    })
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        type="date"
        size="small"
        label="Fecha de medición"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ width: 200 }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
            DATOS GENERALES
          </Typography>
          <Stack spacing={1}>
            {GENERAL_PARAMS.map((param) => (
              <Stack key={param.key} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', flex: 1 }}>{param.label}</Typography>
                <Typography sx={{ fontSize: '11px', color: 'text.secondary', width: 40 }}>
                  {param.unit}
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={param.calc ? generalDisplay(param.key) : (values[param.key] ?? '')}
                  onChange={param.calc ? undefined : set(param.key)}
                  disabled={param.calc}
                  sx={{ width: 110 }}
                />
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
            OBJETIVOS IDEALES
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px', flex: 1 }}>Peso ideal</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', width: 40 }}>kg</Typography>
              <TextField size="small" type="number" value={values.idealWeightKg ?? ''} onChange={set('idealWeightKg')} sx={{ width: 110 }} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px', flex: 1 }}>Masa grasa ideal</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', width: 40 }}>kg</Typography>
              <TextField size="small" type="number" value={values.idealFatMassKg ?? ''} onChange={set('idealFatMassKg')} sx={{ width: 110 }} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px', flex: 1 }}>Grasa a perder</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', width: 40 }}>kg</Typography>
              <TextField size="small" type="number" value={grasaAPerder ?? ''} disabled sx={{ width: 110 }} />
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Box>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
          COMPOSICIÓN POR SEGMENTO
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Parámetro</TableCell>
                <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>Unidad</TableCell>
                {SEGMENTS.map((segment) => (
                  <TableCell key={segment} sx={{ fontSize: '12px', fontWeight: 600 }}>
                    {SEGMENT_LABELS[segment]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {SEGMENT_PARAMS.map((param) => (
                <TableRow key={param.key}>
                  <TableCell sx={{ fontSize: '13px' }}>{param.label}</TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</TableCell>
                  {SEGMENTS.map((segment) => (
                    <TableCell key={segment}>
                      <TextField
                        size="small"
                        type="number"
                        value={
                          param.calc
                            ? (segmentSkeletal(segment)?.toString() ?? '')
                            : (values[`${segment}.${param.key}`] ?? '')
                        }
                        onChange={param.calc ? undefined : set(`${segment}.${param.key}`)}
                        disabled={param.calc}
                        sx={{ width: 90 }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <TextField
        label="Observaciones adicionales / Notas"
        multiline
        minRows={2}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        fullWidth
      />

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && (
          <AppButton variant="text" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </AppButton>
        )}
        <AppButton variant="contained" loading={isSaving} onClick={handleSave}>
          Guardar medición
        </AppButton>
      </Stack>
    </Stack>
  )
}

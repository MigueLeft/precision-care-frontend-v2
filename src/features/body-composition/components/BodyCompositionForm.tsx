import { useState } from 'react'
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

// Los campos "totales" (masa grasa %/kg, masa magra kg) viven en el segmento
// "total"; el resto son columnas de la tabla body_composition.
const IDEAL_KEYS = ['idealWeightKg', 'idealFatMassKg', 'fatToLoseKg']

function initialState(existing?: BodyComposition | null): State {
  const state: State = {}
  if (!existing) return state
  for (const key of [
    'weightKg',
    'heightCm',
    'basalMetabolismKcal',
    'totalWaterKg',
    ...IDEAL_KEYS,
  ]) {
    const value = (existing as unknown as Record<string, string | null>)[key]
    if (value != null) state[key] = value
  }
  const total = getSegment(existing, 'total')
  if (total) {
    if (total.fatMassPct != null) state.totalFatPct = total.fatMassPct
    if (total.fatMassKg != null) state.totalFatKg = total.fatMassKg
    if (total.leanMassKg != null) state.totalLeanKg = total.leanMassKg
  }
  for (const segment of SEGMENTS) {
    const seg = getSegment(existing, segment)
    if (!seg) continue
    for (const param of SEGMENT_PARAMS) {
      const value = (seg as unknown as Record<string, string | null>)[param.key]
      if (value != null) state[`${segment}.${param.key}`] = value
    }
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

  const bmi = computeBmi(n(values.weightKg), n(values.heightCm))

  function segmentSkeletal(segment: string): number | undefined {
    return segmentSkeletalKg(n(values[`${segment}.leanMassKg`]))
  }

  function buildSegments(): SegmentInput[] {
    const out: SegmentInput[] = []
    const total: SegmentInput = {
      segment: 'total',
      fatMassPct: n(values.totalFatPct),
      fatMassKg: n(values.totalFatKg),
      leanMassKg: n(values.totalLeanKg),
    }
    if (
      total.fatMassPct !== undefined ||
      total.fatMassKg !== undefined ||
      total.leanMassKg !== undefined
    ) {
      out.push(total)
    }

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
      weightKg: n(values.weightKg),
      heightCm: n(values.heightCm),
      bmi,
      basalMetabolismKcal: n(values.basalMetabolismKcal),
      totalWaterKg: n(values.totalWaterKg),
      idealWeightKg: n(values.idealWeightKg),
      idealFatMassKg: n(values.idealFatMassKg),
      fatToLoseKg: n(values.fatToLoseKg),
      notes: notes.trim() || undefined,
      segments: buildSegments(),
    })
  }

  const idealFields = [
    { key: 'idealWeightKg', label: 'Peso ideal', unit: 'kg' },
    { key: 'idealFatMassKg', label: 'Masa grasa ideal', unit: 'kg' },
    { key: 'fatToLoseKg', label: 'Grasa a perder', unit: 'kg' },
  ]

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
                  value={param.calc ? (bmi?.toString() ?? '') : (values[param.key] ?? '')}
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
            {idealFields.map((field) => (
              <Stack key={field.key} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ fontSize: '13px', flex: 1 }}>{field.label}</Typography>
                <Typography sx={{ fontSize: '11px', color: 'text.secondary', width: 40 }}>
                  {field.unit}
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={values[field.key] ?? ''}
                  onChange={set(field.key)}
                  sx={{ width: 110 }}
                />
              </Stack>
            ))}
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

import { useState } from 'react'
import { todayIsoDate } from '@/utils/format-date'
import { ANTHROPOMETRY_PARAMS } from '../config'
import { SEGMENTS } from '../segment-config'
import { computeAnthropometry, getSegment, type SegmentLean, type ValueMap } from '../utils/anthropometry-calculations'
import type {
  Anthropometry,
  AnthropometryInputKey,
  SaveAnthropometryInput,
  SegmentInput,
  SegmentInputKey,
} from '../types'

type Raw = Record<string, string>

const SEGMENT_INPUT_KEYS: SegmentInputKey[] = [
  'fatMassPct',
  'fatMassKg',
  'leanMassKg',
  'predictedMuscleMassKg',
]

// Claves capturables (las calculadas no se editan).
const INPUT_KEYS = ANTHROPOMETRY_PARAMS.filter((p) => !p.calc).map(
  (p) => p.key as AnthropometryInputKey,
)

export const segmentField = (segment: string, key: string) => `${segment}.${key}`

const parse = (raw: string | undefined) => {
  if (raw === undefined || raw.trim() === '') return undefined
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function initialValues(existing: Anthropometry | null | undefined): Raw {
  const raw: Raw = {}
  if (!existing) return raw
  for (const key of INPUT_KEYS) {
    const value = existing[key]
    if (value != null) raw[key] = value
  }
  for (const segment of SEGMENTS) {
    const row = getSegment(existing, segment)
    for (const key of SEGMENT_INPUT_KEYS) {
      const value = row?.[key]
      if (value != null) raw[segmentField(segment, key)] = value
    }
  }
  return raw
}

// Estado del formulario de antropometría: valores en texto, vista previa de los
// calculados y armado del payload (vacío = null para borrar al editar).
export function useAnthropometryForm(existing: Anthropometry | null | undefined) {
  const [raw, setRaw] = useState<Raw>(() => initialValues(existing))
  const [date, setDate] = useState(
    existing?.assessmentDate ? existing.assessmentDate.slice(0, 10) : todayIsoDate(),
  )
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const setField = (field: string, value: string) =>
    setRaw((prev) => ({ ...prev, [field]: value }))

  const values: ValueMap = {}
  for (const key of INPUT_KEYS) {
    const value = parse(raw[key])
    if (value !== undefined) values[key] = value
  }
  const segmentLean: SegmentLean = {}
  for (const segment of SEGMENTS) {
    const lean = parse(raw[segmentField(segment, 'leanMassKg')])
    if (lean !== undefined) segmentLean[segment] = lean
  }
  const computed = computeAnthropometry(values, segmentLean)

  function buildSegments(): SegmentInput[] {
    return SEGMENTS.flatMap((segment) => {
      const row: SegmentInput = { segment }
      for (const key of SEGMENT_INPUT_KEYS) row[key] = parse(raw[segmentField(segment, key)]) ?? null
      return SEGMENT_INPUT_KEYS.some((key) => row[key] != null) ? [row] : []
    })
  }

  function buildInput(patientId: number, consultationId?: number): SaveAnthropometryInput {
    const input: SaveAnthropometryInput = {
      patientId,
      consultationId,
      assessmentDate: date,
      notes: notes.trim() || null,
      segments: buildSegments(),
    }
    for (const key of INPUT_KEYS) input[key] = values[key] ?? null
    return input
  }

  return { raw, setField, computed, date, setDate, notes, setNotes, buildInput }
}

export type AnthropometrySegmentType =
  | 'right_arm'
  | 'left_arm'
  | 'right_leg'
  | 'left_leg'
  | 'torso'

// Valores capturados a mano (deben coincidir con el DTO del backend).
export type AnthropometryInputKey =
  | 'heightCm'
  | 'weightKg'
  | 'fatMassPct'
  | 'totalWaterKg'
  | 'basalMetabolismKcal'
  | 'abdominalCircCm'
  | 'hipCircCm'
  | 'neckCircCm'
  | 'gripRightKg'
  | 'gripLeftKg'
  | 'systolicBp'
  | 'diastolicBp'
  | 'heartRate'
  | 'oxygenSaturation'
  | 'brachialCircCm'
  | 'tricepsSkinfoldMm'
  | 'subscapularSkinfoldMm'
  | 'abdominalSkinfoldMm'
  | 'suprailiacSkinfoldMm'
  | 'thighSkinfoldMm'

// Valores que calcula el backend al guardar.
export type AnthropometryComputedKey =
  | 'bmi'
  | 'fatMassKg'
  | 'leanMassPct'
  | 'leanMassKg'
  | 'skeletalMuscleMassKg'
  | 'appendicularLeanMassKg'
  | 'appendicularLeanMassIndex'
  | 'waistHipRatio'
  | 'armMuscleCircCm'

// Solo se muestra (no se guarda): asimetría de fuerza entre manos.
export type AnthropometryValueKey =
  | AnthropometryInputKey
  | AnthropometryComputedKey
  | 'gripAsymmetryPct'

export type SegmentInputKey = 'fatMassPct' | 'fatMassKg' | 'leanMassKg' | 'predictedMuscleMassKg'

export interface AnthropometrySegment {
  id: number
  anthropometryId: number
  segment: AnthropometrySegmentType
  fatMassPct: string | null
  fatMassKg: string | null
  leanMassKg: string | null
  predictedMuscleMassKg: string | null
  skeletalMuscleMassKg: string | null
}

// Las columnas `numeric` llegan como string.
export type Anthropometry = {
  id: number
  patientId: number
  consultationId: number | null
  assessmentDate: string
  notes: string | null
  segments: AnthropometrySegment[]
  createdAt: string
  updatedAt: string
} & Record<AnthropometryInputKey | AnthropometryComputedKey, string | null>

export type SegmentInput = { segment: AnthropometrySegmentType } & Partial<
  Record<SegmentInputKey, number | null>
>

// null borra el valor al editar.
export type SaveAnthropometryInput = {
  patientId: number
  consultationId?: number
  assessmentDate?: string
  notes?: string | null
  segments: SegmentInput[]
} & Partial<Record<AnthropometryInputKey, number | null>>

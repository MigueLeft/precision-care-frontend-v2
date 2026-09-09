export type BodySegment =
  | 'left_arm'
  | 'right_arm'
  | 'left_leg'
  | 'right_leg'
  | 'torso'
  | 'total'

export interface BodyCompositionSegment {
  id: number
  bodyCompositionId: number
  segment: BodySegment
  fatMassPct: string | null
  fatMassKg: string | null
  leanMassKg: string | null
  skeletalMuscleMassKg: string | null
  predictedMuscleMassKg: string | null
}

export interface BodyComposition {
  id: number
  patientId: number
  consultationId: number | null
  assessmentDate: string
  weightKg: string | null
  heightCm: string | null
  bmi: string | null
  basalMetabolismKcal: string | null
  totalWaterKg: string | null
  idealWeightKg: string | null
  idealFatMassKg: string | null
  fatToLoseKg: string | null
  notes: string | null
  segments: BodyCompositionSegment[]
  createdAt: string
  updatedAt: string
}

export interface SegmentInput {
  segment: BodySegment
  fatMassPct?: number
  fatMassKg?: number
  leanMassKg?: number
  skeletalMuscleMassKg?: number
  predictedMuscleMassKg?: number
}

export interface SaveBodyCompositionInput {
  patientId: number
  consultationId?: number
  assessmentDate?: string
  weightKg?: number
  heightCm?: number
  bmi?: number
  basalMetabolismKcal?: number
  totalWaterKg?: number
  idealWeightKg?: number
  idealFatMassKg?: number
  fatToLoseKg?: number
  notes?: string
  segments?: SegmentInput[]
}

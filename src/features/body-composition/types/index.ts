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
  leanMassPct: string | null
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
  segments: BodyCompositionSegment[]
  createdAt: string
  updatedAt: string
}

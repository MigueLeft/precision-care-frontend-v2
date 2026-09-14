export type LifestyleComponentType =
  | 'diet'
  | 'physical_activity'
  | 'nicotine'
  | 'sleep'
  | 'bmi'
  | 'lipids'
  | 'glucose'
  | 'blood_pressure'

export interface LifestyleComponent {
  component: LifestyleComponentType
  score: string
  rawValue: Record<string, unknown> | null
}

export interface LifestyleAssessment {
  id: number
  patientId: number
  assessmentDate: string
  globalScore: string | null
  intakeResponseId: number | null
  components: LifestyleComponent[]
  createdAt: string
  updatedAt: string
}

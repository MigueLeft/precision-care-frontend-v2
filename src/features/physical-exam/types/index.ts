export interface VitalSigns {
  ta_sistolica?: number
  ta_diastolica?: number
  fc?: number
  fr?: number
  temp?: number
  sat_o2?: number
}

export interface PhysicalExam {
  id: number
  patientId: number
  consultationId: number
  examDate: string
  vitalSigns: VitalSigns | null
  content: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

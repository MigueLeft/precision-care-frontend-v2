import { api } from '@/utils/api'

export interface Prescription {
  id: number
  consultationId: number
  medicationId: number
  dose: string
  route: string | null
  frequency: string
  duration: string
  instructions: string | null
  createdAt: string
  updatedAt: string
  // Adjuntado por el backend (join a medication_catalog).
  brandName: string | null
  genericName: string | null
  concentration: string | null
}

export async function fetchPrescriptionsByConsultation(
  consultationId: number,
): Promise<Prescription[]> {
  const { data } = await api.get<{ prescriptions: Prescription[] }>(
    `/prescriptions/consultation/${consultationId}`,
  )
  return data.prescriptions
}

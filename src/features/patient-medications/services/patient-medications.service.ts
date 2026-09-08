import { api } from '@/utils/api'
import type {
  PatientMedication,
  CreatePatientMedicationPayload,
  UpdatePatientMedicationPayload,
} from '../types'

export async function fetchPatientMedications(
  patientId: number,
): Promise<PatientMedication[]> {
  const { data } = await api.get<{ medications: PatientMedication[] }>(
    `/medications/patient/${patientId}`,
  )
  return data.medications
}

export async function createPatientMedication(
  payload: CreatePatientMedicationPayload,
): Promise<PatientMedication> {
  const { data } = await api.post<{ medication: PatientMedication }>(
    '/medications',
    payload,
  )
  return data.medication
}

export async function updatePatientMedication(
  id: number,
  payload: UpdatePatientMedicationPayload,
): Promise<PatientMedication> {
  const { data } = await api.patch<{ medication: PatientMedication }>(
    `/medications/${id}`,
    payload,
  )
  return data.medication
}

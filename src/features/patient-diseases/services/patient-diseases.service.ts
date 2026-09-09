import { api } from '@/utils/api'
import type {
  PatientDisease,
  AddPatientDiseaseInput,
  UpdatePatientDiseaseInput,
} from '../types'

export async function fetchPatientDiseases(
  patientId: number,
): Promise<PatientDisease[]> {
  const { data } = await api.get<{ diseases: PatientDisease[] }>(
    `/patients/${patientId}/diseases`,
  )
  return data.diseases
}

export async function addPatientDisease(
  patientId: number,
  input: AddPatientDiseaseInput,
): Promise<PatientDisease> {
  const { data } = await api.post<{ disease: PatientDisease }>(
    `/patients/${patientId}/diseases`,
    input,
  )
  return data.disease
}

export async function updatePatientDisease(
  patientId: number,
  diseaseId: number,
  input: UpdatePatientDiseaseInput,
): Promise<PatientDisease> {
  const { data } = await api.patch<{ disease: PatientDisease }>(
    `/patients/${patientId}/diseases/${diseaseId}`,
    input,
  )
  return data.disease
}

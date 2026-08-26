import { api } from '@/utils/api'
import type { Patient, Allergy } from '../types'
import type { CreatePatientDto, UpdatePatientDto } from '../schemas/patient.schema'

export async function fetchPatients(): Promise<Patient[]> {
  const { data } = await api.get<{ patients: Patient[] }>('/patients')
  return data.patients
}

export async function fetchPatient(id: number): Promise<Patient> {
  const { data } = await api.get<{ patient: Patient }>(`/patients/${id}`)
  return data.patient
}

export async function createPatient(payload: CreatePatientDto): Promise<Patient> {
  const { data } = await api.post<{ patient: Patient }>('/patients', payload)
  return data.patient
}

export async function updatePatient(id: number, payload: UpdatePatientDto): Promise<Patient> {
  const { data } = await api.patch<{ patient: Patient }>(`/patients/${id}`, payload)
  return data.patient
}

export async function deletePatient(id: number): Promise<Patient> {
  const { data } = await api.delete<{ patient: Patient }>(`/patients/${id}`)
  return data.patient
}

export async function fetchPatientAllergies(patientId: number): Promise<Allergy[]> {
  const { data } = await api.get<{ allergies: Allergy[] }>(`/patients/${patientId}/allergies`)
  return data.allergies
}

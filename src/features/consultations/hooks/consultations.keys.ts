export const consultationsKeys = {
  all: ['consultations'] as const,
  byPatient: (patientId: number) =>
    [...consultationsKeys.all, 'patient', patientId] as const,
  patientSymptoms: (patientId: number) =>
    [...consultationsKeys.all, 'patient', patientId, 'symptoms'] as const,
  byAppointment: (appointmentId: number) =>
    [...consultationsKeys.all, 'appointment', appointmentId] as const,
  detail: (id: number) => [...consultationsKeys.all, 'detail', id] as const,
  diagnoses: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'diagnoses'] as const,
  symptoms: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'symptoms'] as const,
  symptomHistory: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'symptom-history'] as const,
  allergies: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'allergies'] as const,
  allergyHistory: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'allergy-history'] as const,
  diseases: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'diseases'] as const,
  diseaseHistory: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'disease-history'] as const,
  medications: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'medications'] as const,
  medicationHistory: (id: number) =>
    [...consultationsKeys.all, 'detail', id, 'medication-history'] as const,
}

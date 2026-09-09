export const physicalExamKeys = {
  all: ['physical-exams'] as const,
  byPatient: (patientId: number) =>
    [...physicalExamKeys.all, 'patient', patientId] as const,
  byConsultation: (consultationId: number) =>
    [...physicalExamKeys.all, 'consultation', consultationId] as const,
}

export const physicalExamKeys = {
  all: ['physical-exams'] as const,
  byPatient: (patientId: number) =>
    [...physicalExamKeys.all, 'patient', patientId] as const,
}

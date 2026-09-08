export const lifestyleKeys = {
  all: ['lifestyle'] as const,
  byPatient: (patientId: number) =>
    [...lifestyleKeys.all, 'patient', patientId] as const,
}

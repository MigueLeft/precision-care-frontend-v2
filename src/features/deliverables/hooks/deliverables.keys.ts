export const deliverablesKeys = {
  all: ['deliverables'] as const,
  byPatient: (patientId: number) =>
    [...deliverablesKeys.all, 'patient', patientId] as const,
}

export const deliverablesKeys = {
  all: ['deliverables'] as const,
  templates: ['deliverables', 'templates'] as const,
  byPatient: (patientId: number) =>
    [...deliverablesKeys.all, 'patient', patientId] as const,
  drafts: (consultationId: number) =>
    [...deliverablesKeys.all, 'drafts', consultationId] as const,
}

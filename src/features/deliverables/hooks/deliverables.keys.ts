export const deliverablesKeys = {
  all: ['deliverables'] as const,
  templates: ['deliverables', 'templates'] as const,
  byPatient: (patientId: number) =>
    [...deliverablesKeys.all, 'patient', patientId] as const,
  drafts: (consultationId: number) =>
    [...deliverablesKeys.all, 'drafts', consultationId] as const,
  studyOrders: (consultationId: number) =>
    [...deliverablesKeys.all, 'study-orders', 'consultation', consultationId] as const,
  studyOrder: (id: number) => [...deliverablesKeys.all, 'study-orders', id] as const,
}

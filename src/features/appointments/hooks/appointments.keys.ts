export const appointmentsKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentsKeys.all, 'list'] as const,
  byPatient: (patientId: number) =>
    [...appointmentsKeys.all, 'patient', patientId] as const,
  detail: (id: number) => [...appointmentsKeys.all, 'detail', id] as const,
}

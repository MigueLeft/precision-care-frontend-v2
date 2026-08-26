export const patientsKeys = {
  all: ['patients'] as const,
  lists: () => [...patientsKeys.all, 'list'] as const,
  detail: (id: number) => [...patientsKeys.all, 'detail', id] as const,
  allergies: (patientId: number) => [...patientsKeys.all, 'allergies', patientId] as const,
}

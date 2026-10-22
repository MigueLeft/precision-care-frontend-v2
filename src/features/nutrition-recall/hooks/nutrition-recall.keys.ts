export const nutritionRecallKeys = {
  all: ['nutrition-recalls'] as const,
  byPatient: (patientId: number) => [...nutritionRecallKeys.all, 'patient', patientId] as const,
  detail: (id: number) => [...nutritionRecallKeys.all, 'detail', id] as const,
  public: (token: string) => [...nutritionRecallKeys.all, 'public', token] as const,
}

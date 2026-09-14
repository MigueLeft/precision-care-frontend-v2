export const intakeKeys = {
  all: ['intakes'] as const,
  lists: () => [...intakeKeys.all, 'list'] as const,
  detail: (id: number) => [...intakeKeys.all, 'detail', id] as const,
}

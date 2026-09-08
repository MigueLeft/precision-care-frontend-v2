export const specialistsKeys = {
  all: ['specialists'] as const,
  lists: () => ['specialists', 'list'] as const,
  detail: (id: number) => ['specialists', 'detail', id] as const,
}

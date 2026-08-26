export const questionnairesKeys = {
  all: ['questionnaires'] as const,
  lists: () => [...questionnairesKeys.all, 'list'] as const,
  detail: (id: number) => [...questionnairesKeys.all, 'detail', id] as const,
}

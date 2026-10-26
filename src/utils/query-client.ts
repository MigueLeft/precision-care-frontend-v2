import { MutationCache, QueryClient } from '@tanstack/react-query'

export const queryClient: QueryClient = new QueryClient({
  // Tras cualquier mutación se refrescan los scores de riesgo visibles (el
  // backend los recalcula con los datos vigentes).
  mutationCache: new MutationCache({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['risk'] })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

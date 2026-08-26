import { createFileRoute } from '@tanstack/react-router'
import { CatalogsPage, catalogsKeys, fetchMedications } from '@/features/catalogs'

export const Route = createFileRoute('/_app/catalogos')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ queryKey: catalogsKeys.medications, queryFn: fetchMedications }),
  component: CatalogsPage,
})

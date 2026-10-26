import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'
import { CatalogsPage, catalogsKeys, fetchMedications } from '@/features/catalogs'

export const Route = createFileRoute('/_app/catalogos')({
  beforeLoad: requirePermission('catalogos:update'),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ queryKey: catalogsKeys.medications, queryFn: fetchMedications }),
  component: CatalogsPage,
})

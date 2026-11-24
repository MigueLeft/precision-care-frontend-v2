import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/features/identity'
import { PatientsPage, patientsListSearchSchema, patientsListOptions } from '@/features/patients'
import { catalogsKeys, fetchCountries } from '@/features/catalogs'

export const Route = createFileRoute('/_app/pacientes')({
  beforeLoad: requirePermission('pacientes:read'),
  validateSearch: (search) => patientsListSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ q: search.q, nationalityCountryId: search.nationalityCountryId }),
  loader: ({ context: { queryClient }, deps }) => {
    // Los países solo enriquecen la tabla (la página usa `= []` mientras llegan):
    // se precargan sin bloquear la navegación.
    void queryClient.prefetchQuery({ queryKey: catalogsKeys.countries, queryFn: fetchCountries })
    // La búsqueda no bloquea la escritura; la tabla muestra su carga o error.
    void queryClient.prefetchQuery(patientsListOptions(deps))
  },
  component: PacientesRoute,
})

function PacientesRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <PatientsPage
      searchParams={search}
      onSearchParamsChange={(next) =>
        navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })
      }
    />
  )
}

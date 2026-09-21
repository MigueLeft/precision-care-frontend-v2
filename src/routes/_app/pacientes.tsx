import { createFileRoute } from '@tanstack/react-router'
import { PatientsPage, patientsListSearchSchema, patientsKeys, fetchPatients } from '@/features/patients'
import { catalogsKeys, fetchCountries } from '@/features/catalogs'

export const Route = createFileRoute('/_app/pacientes')({
  validateSearch: (search) => patientsListSearchSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    // Los países solo enriquecen la tabla (la página usa `= []` mientras llegan):
    // se precargan sin bloquear la navegación.
    void queryClient.prefetchQuery({ queryKey: catalogsKeys.countries, queryFn: fetchCountries })
    return queryClient.ensureQueryData({ queryKey: patientsKeys.lists(), queryFn: fetchPatients })
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

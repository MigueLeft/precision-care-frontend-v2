import { createFileRoute } from '@tanstack/react-router'
import { PatientsPage, patientsListSearchSchema, patientsKeys, fetchPatients } from '@/features/patients'
import { catalogsKeys, fetchCountries } from '@/features/catalogs'

export const Route = createFileRoute('/_app/pacientes')({
  validateSearch: (search) => patientsListSearchSchema.parse(search),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({ queryKey: patientsKeys.lists(), queryFn: fetchPatients }),
      queryClient.ensureQueryData({ queryKey: catalogsKeys.countries, queryFn: fetchCountries }),
    ]),
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

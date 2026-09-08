import { createFileRoute } from '@tanstack/react-router'
import { SpecialistFormPage } from '@/features/specialists'
import { catalogsKeys, fetchCountries, fetchMedicalSpecialties } from '@/features/catalogs'
import { identityKeys, fetchRoles } from '@/features/identity'

export const Route = createFileRoute('/_app/especialistas_/nuevo')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({ queryKey: catalogsKeys.countries, queryFn: fetchCountries }),
      queryClient.ensureQueryData({
        queryKey: catalogsKeys.medicalSpecialties,
        queryFn: fetchMedicalSpecialties,
      }),
      queryClient.ensureQueryData({ queryKey: identityKeys.roles, queryFn: fetchRoles }),
    ]),
  component: NuevoEspecialistaRoute,
})

function NuevoEspecialistaRoute() {
  return <SpecialistFormPage mode="create" />
}

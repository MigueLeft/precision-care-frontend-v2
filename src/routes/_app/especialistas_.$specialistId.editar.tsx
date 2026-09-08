import { createFileRoute } from '@tanstack/react-router'
import { SpecialistFormPage, specialistsKeys, fetchSpecialist } from '@/features/specialists'
import { catalogsKeys, fetchCountries, fetchMedicalSpecialties } from '@/features/catalogs'

export const Route = createFileRoute('/_app/especialistas_/$specialistId/editar')({
  loader: ({ context: { queryClient }, params: { specialistId } }) =>
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: specialistsKeys.detail(Number(specialistId)),
        queryFn: () => fetchSpecialist(Number(specialistId)),
      }),
      queryClient.ensureQueryData({ queryKey: catalogsKeys.countries, queryFn: fetchCountries }),
      queryClient.ensureQueryData({
        queryKey: catalogsKeys.medicalSpecialties,
        queryFn: fetchMedicalSpecialties,
      }),
    ]),
  component: EditarEspecialistaRoute,
})

function EditarEspecialistaRoute() {
  const { specialistId } = Route.useParams()
  return <SpecialistFormPage mode="edit" specialistId={Number(specialistId)} />
}

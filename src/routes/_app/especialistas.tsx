import { createFileRoute } from '@tanstack/react-router'
import { SpecialistsPage, specialistsKeys, fetchSpecialists } from '@/features/specialists'
import { catalogsKeys, fetchMedicalSpecialties } from '@/features/catalogs'

export const Route = createFileRoute('/_app/especialistas')({
  loader: ({ context: { queryClient } }) => {
    // Las especialidades solo alimentan el filtro (la toolbar usa `= []`): se
    // precargan sin bloquear la navegación.
    void queryClient.prefetchQuery({
      queryKey: catalogsKeys.medicalSpecialties,
      queryFn: fetchMedicalSpecialties,
    })
    return queryClient.ensureQueryData({
      queryKey: specialistsKeys.lists(),
      queryFn: fetchSpecialists,
    })
  },
  component: SpecialistsPage,
})

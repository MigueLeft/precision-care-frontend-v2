import { createFileRoute } from '@tanstack/react-router'
import { SpecialistsPage, specialistsKeys, fetchSpecialists } from '@/features/specialists'
import { catalogsKeys, fetchMedicalSpecialties } from '@/features/catalogs'

export const Route = createFileRoute('/_app/especialistas')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: specialistsKeys.lists(),
        queryFn: fetchSpecialists,
      }),
      queryClient.ensureQueryData({
        queryKey: catalogsKeys.medicalSpecialties,
        queryFn: fetchMedicalSpecialties,
      }),
    ]),
  component: SpecialistsPage,
})

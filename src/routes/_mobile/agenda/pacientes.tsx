import { createFileRoute } from '@tanstack/react-router'
import { MobilePatientsPage, fetchPatients, patientsKeys } from '@/features/patients'

export const Route = createFileRoute('/_mobile/agenda/pacientes')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: patientsKeys.lists(),
      queryFn: fetchPatients,
    }),
  component: MobilePatientsPage,
})

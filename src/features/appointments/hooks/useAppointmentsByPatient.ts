import { useQuery } from '@tanstack/react-query'
import { fetchAppointmentsByPatient } from '../services/appointments.service'
import { appointmentsKeys } from './appointments.keys'

export function useAppointmentsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: appointmentsKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchAppointmentsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}

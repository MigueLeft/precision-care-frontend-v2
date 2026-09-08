import { useQuery } from '@tanstack/react-query'
import { fetchAppointments, fetchAppointment } from '../services/appointments.service'
import { appointmentsKeys } from './appointments.keys'

export function useAppointments() {
  return useQuery({
    queryKey: appointmentsKeys.lists(),
    queryFn: fetchAppointments,
  })
}

export function useAppointment(id: number | undefined) {
  return useQuery({
    queryKey: appointmentsKeys.detail(id ?? 0),
    queryFn: () => fetchAppointment(id as number),
    enabled: typeof id === 'number',
  })
}

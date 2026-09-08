import { useQuery } from '@tanstack/react-query'
import { fetchPhysicalExamsByPatient } from '../services/physical-exam.service'
import { physicalExamKeys } from './physical-exam.keys'

export function usePhysicalExamsByPatient(patientId: number | undefined) {
  return useQuery({
    queryKey: physicalExamKeys.byPatient(patientId ?? 0),
    queryFn: () => fetchPhysicalExamsByPatient(patientId as number),
    enabled: typeof patientId === 'number',
  })
}

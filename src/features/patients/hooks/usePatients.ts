import { useQuery } from '@tanstack/react-query'
import { patientsListOptions } from './patients.queries'
import type { PatientListFilters } from '../types'

export function usePatients(filters: PatientListFilters = {}) {
  return useQuery(patientsListOptions(filters))
}

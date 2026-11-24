import { queryOptions } from '@tanstack/react-query'
import { fetchPatients } from '../services/patients.service'
import type { PatientListFilters } from '../types'
import { patientsKeys } from './patients.keys'

export function patientsListOptions(filters: PatientListFilters = {}) {
  const params = { q: filters.q?.trim() || undefined, nationalityCountryId: filters.nationalityCountryId }
  return queryOptions({
    queryKey: [...patientsKeys.lists(), params],
    queryFn: ({ signal }) => fetchPatients(params, signal),
  })
}

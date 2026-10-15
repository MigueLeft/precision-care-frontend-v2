import { useQuery } from '@tanstack/react-query'
import { fetchLabProfiles } from '../services/lab-profiles.service'
import { catalogsKeys } from './catalogs.keys'

export function useLabProfiles() {
  return useQuery({
    queryKey: catalogsKeys.labProfiles,
    queryFn: fetchLabProfiles,
  })
}

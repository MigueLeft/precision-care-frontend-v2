import { useQuery } from '@tanstack/react-query'
import { fetchSpecialistsLookup } from '../services/specialists-lookup.service'
import { identityKeys } from './identity.keys'

export function useSpecialistsLookup() {
  return useQuery({
    queryKey: identityKeys.specialistsLookup,
    queryFn: fetchSpecialistsLookup,
  })
}

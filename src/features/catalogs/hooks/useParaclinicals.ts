import { useQuery } from '@tanstack/react-query'
import { fetchParaclinicals } from '../services/paraclinicals.service'
import { catalogsKeys } from './catalogs.keys'

export function useParaclinicals() {
  return useQuery({
    queryKey: catalogsKeys.paraclinicals,
    queryFn: fetchParaclinicals,
  })
}

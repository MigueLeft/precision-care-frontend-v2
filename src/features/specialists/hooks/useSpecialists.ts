import { useQuery } from '@tanstack/react-query'
import { fetchSpecialists, fetchSpecialist } from '../services/specialists.service'
import { specialistsKeys } from './specialists.keys'

export function useSpecialists() {
  return useQuery({
    queryKey: specialistsKeys.lists(),
    queryFn: fetchSpecialists,
  })
}

export function useSpecialist(id: number) {
  return useQuery({
    queryKey: specialistsKeys.detail(id),
    queryFn: () => fetchSpecialist(id),
  })
}

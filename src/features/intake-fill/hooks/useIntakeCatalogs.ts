import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportAndRethrow } from '@/utils/report-error'
import { fetchPublicIntakeCatalogs } from '../services/intake-fill.service'
import type { PublicIntakeCatalogs } from '../types'

export const EMPTY_INTAKE_CATALOGS: PublicIntakeCatalogs = {
  countries: [],
  surgeries: [],
  hospitalizations: [],
  foodAllergies: [],
}

// Catálogos del formulario público. Se cargan una vez por token y se comparten
// por contexto para que cada campo no tenga que recibirlos por props.
export const IntakeCatalogsContext = createContext<PublicIntakeCatalogs>(EMPTY_INTAKE_CATALOGS)

export function useIntakeCatalogs(): PublicIntakeCatalogs {
  return useContext(IntakeCatalogsContext)
}

export function usePublicIntakeCatalogs(token: string) {
  return useQuery({
    queryKey: ['public-intake-catalogs', token] as const,
    queryFn: () => fetchPublicIntakeCatalogs(token).catch(reportAndRethrow('public-intake')),
    enabled: token.length > 0,
    staleTime: Infinity,
  })
}

import { api } from '@/utils/api'
import type { SpecialistLookup } from '../types'

export async function fetchSpecialistsLookup(): Promise<SpecialistLookup[]> {
  const { data } = await api.get<{ specialists: SpecialistLookup[] }>('/specialists')
  return data.specialists
}

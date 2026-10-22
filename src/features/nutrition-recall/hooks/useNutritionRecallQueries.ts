import { useQuery } from '@tanstack/react-query'
import {
  fetchNutritionRecallDetail,
  fetchNutritionRecallsByPatient,
} from '../services/nutrition-recall.service'
import { fetchPublicNutritionRecall } from '../services/public-nutrition-recall.service'
import { nutritionRecallKeys } from './nutrition-recall.keys'

export function useNutritionRecallsByPatient(patientId: number) {
  return useQuery({
    queryKey: nutritionRecallKeys.byPatient(patientId),
    queryFn: () => fetchNutritionRecallsByPatient(patientId),
  })
}

export function useNutritionRecallDetail(id: number | null) {
  return useQuery({
    queryKey: nutritionRecallKeys.detail(id ?? 0),
    queryFn: () => fetchNutritionRecallDetail(id as number),
    enabled: id !== null,
  })
}

// Contexto de la página pública (nombre del paciente, si ya se completó).
export function usePublicNutritionRecall(token: string) {
  return useQuery({
    queryKey: nutritionRecallKeys.public(token),
    queryFn: () => fetchPublicNutritionRecall(token),
    retry: false,
    staleTime: Infinity,
  })
}

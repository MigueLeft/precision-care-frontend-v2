import { useState } from 'react'
import { useCreateParaclinicalResult } from './useCreateParaclinicalResult'
import { useParaclinicalResultsByPatient } from './useParaclinicalResultsByPatient'
import { findSameDayStudy, type SameDayStudy } from '../utils/single-study-result'
import type { CreateParaclinicalResultInput } from '../types'

interface PendingReplacement {
  input: CreateParaclinicalResultInput
  existing: SameDayStudy
}

// Alta de un resultado cuidando que un estudio no se registre dos veces en la
// misma fecha: si ya existe, queda pendiente hasta que se confirme reemplazarlo.
export function useAddParaclinicalResult(
  patientId: number,
  onAdded?: (input: CreateParaclinicalResultInput) => void,
) {
  const { data: results = [] } = useParaclinicalResultsByPatient(patientId)
  const createMutation = useCreateParaclinicalResult(patientId)
  const [pending, setPending] = useState<PendingReplacement | null>(null)

  function create(input: CreateParaclinicalResultInput) {
    createMutation.mutate(input, {
      onSuccess: () => {
        setPending(null)
        onAdded?.(input)
      },
    })
  }

  function add(input: CreateParaclinicalResultInput) {
    const existing = findSameDayStudy(results, input)
    if (existing) {
      setPending({ input, existing })
      return
    }
    create(input)
  }

  return {
    add,
    isAdding: createMutation.isPending,
    pending,
    confirmReplace: () => pending && create({ ...pending.input, replaceExisting: true }),
    cancelReplace: () => setPending(null),
  }
}

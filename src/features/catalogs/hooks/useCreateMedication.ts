import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMedication } from '../services/medications.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Medication } from '../types'

interface UseCreateMedicationOptions {
  onSuccess?: (medication: Medication) => void
}

export function useCreateMedication(options?: UseCreateMedicationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedication,
    onSuccess: (medication) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medications })
      toast.success(`Medicamento ${medication.brandName} creado correctamente`)
      options?.onSuccess?.(medication)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear el medicamento'))
    },
  })
}

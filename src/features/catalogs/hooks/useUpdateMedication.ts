import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateMedication } from '../services/medications.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import type { Medication, UpdateMedicationPayload } from '../types'

interface UseUpdateMedicationOptions {
  onSuccess?: (medication: Medication) => void
}

export function useUpdateMedication(id: number | undefined, options?: UseUpdateMedicationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateMedicationPayload) => updateMedication(id as number, payload),
    onSuccess: (medication) => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medications })
      toast.success('Medicamento actualizado correctamente')
      options?.onSuccess?.(medication)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al actualizar el medicamento'))
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMedicalSpecialty } from '../services/catalogs.service'
import { catalogsKeys } from './catalogs.keys'
import { getApiErrorMessage } from '@/utils/get-api-error-message'

export function useCreateMedicalSpecialty(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicalSpecialty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogsKeys.medicalSpecialties })
      toast.success('Especialidad creada correctamente')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Error al crear la especialidad'))
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/utils/toast'
import { lifestyleKeys } from '@/features/lifestyle'
import { intakeResponsesKeys } from '@/features/intake-responses'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { recalculateConsultationLifestyle } from '../services/consultations.service'

// Recalcula el estilo de vida (Life's Essential 8) del paciente a partir de
// su formulario de ingreso ya guardado (ver POST /consultations/:id/recalculate-lifestyle).
// Útil tras corregir una pregunta/mapeo del IM1 sin que el paciente tenga que
// volver a llenarlo.
export function useRecalculateLifestyle(consultationId: number, patientId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => recalculateConsultationLifestyle(consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifestyleKeys.byPatient(patientId) })
      // Prefijo: invalida tanto la lista del paciente como el detalle (donde
      // viven los scores que no son uno de los 8 componentes de LE8).
      queryClient.invalidateQueries({ queryKey: intakeResponsesKeys.all })
      toast.success('Estilo de vida recalculado con las respuestas del formulario de ingreso.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo recalcular el estilo de vida.'))
    },
  })
}

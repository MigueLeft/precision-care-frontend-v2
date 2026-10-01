import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { antecedentsKeys } from '@/features/antecedents'
import { patientMedicationsKeys } from '@/features/patient-medications'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { landConsultationIntake } from '../services/consultations.service'
import { describeLanding, totalLanded } from '../utils/landing-summary'
import { consultationsKeys } from './consultations.keys'

// Aterriza el formulario de ingreso del paciente en la consulta. Lo que ya
// estaba en el expediente no se duplica (ver POST /consultations/:id/land-intake).
export function useLandConsultationIntake(consultationId: number, patientId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => landConsultationIntake(consultationId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: consultationsKeys.detail(consultationId) })
      queryClient.invalidateQueries({ queryKey: consultationsKeys.patientSymptoms(patientId) })
      queryClient.invalidateQueries({ queryKey: antecedentsKeys.byPatient(patientId) })
      queryClient.invalidateQueries({ queryKey: patientMedicationsKeys.all })
      // Lo que no estaba en los catálogos se da de alta al aterrizar.
      queryClient.invalidateQueries({ queryKey: ['catalogs'] })

      if (totalLanded(result) === 0) {
        toast.info('La información del formulario de ingreso ya estaba en el expediente.')
        return
      }
      toast.success(`Información aterrizada: ${describeLanding(result)}`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'No se pudo aterrizar la información del formulario.'))
    },
  })
}

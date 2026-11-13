import { useEffect } from 'react'
import { useEncounterWorkspace } from '../workspace-context'

// Volver y el clic en el fondo cancelan también formularios sin selección.
// Mientras se guarda, se conserva la captura hasta recibir la respuesta.
export function useCaptureCancel(onCancel: () => void, loading: boolean) {
  const { registerCaptureCancel } = useEncounterWorkspace()
  useEffect(() => registerCaptureCancel(() => {
    if (!loading) onCancel()
  }), [registerCaptureCancel, onCancel, loading])
}

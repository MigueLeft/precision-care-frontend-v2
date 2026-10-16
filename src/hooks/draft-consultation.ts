import { createContext, useContext } from 'react'

// Consulta en curso desde la que se captura. Lo que se registra dentro de ella
// queda como borrador y llega al expediente solo al finalizarla; fuera de la
// consulta (expediente) el valor es undefined.
export const DraftConsultationContext = createContext<number | undefined>(undefined)

export function useDraftConsultationId(): number | undefined {
  return useContext(DraftConsultationContext)
}

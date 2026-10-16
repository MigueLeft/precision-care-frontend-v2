// Lecturas/escrituras desde una consulta en curso: el backend incluye su
// borrador (lo capturado aún no llega al expediente hasta finalizarla).
export function draftParams(consultationId?: number) {
  return consultationId ? { params: { consultationId } } : undefined
}

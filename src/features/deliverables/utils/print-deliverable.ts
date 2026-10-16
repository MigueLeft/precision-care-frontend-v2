import type { ConsultationDeliverableType, LabOrderData, PrescriptionData } from '../types'
import { buildLabOrderHtml } from './print-lab-order'
import { buildPrescriptionHtml } from './print-prescription'
import { printHtml } from './print-shared'

export function buildDeliverableHtml(
  type: ConsultationDeliverableType,
  data: LabOrderData | PrescriptionData,
) {
  return type === 'lab_order'
    ? buildLabOrderHtml(data as LabOrderData)
    : buildPrescriptionHtml(data as PrescriptionData)
}

// Imprime el entregable en hoja carta partida a la mitad (sin abrir otra pestaña).
export function printDeliverable(
  type: ConsultationDeliverableType,
  data: LabOrderData | PrescriptionData,
) {
  printHtml(buildDeliverableHtml(type, data))
}

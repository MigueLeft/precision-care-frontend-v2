import type { LabOrderData, PrescriptionData, StudyOrderData } from '../types'
import { buildLabOrderHtml } from './print-lab-order'
import { buildPrescriptionHtml } from './print-prescription'
import { buildStudyOrderHtml } from './print-study-order'
import { printHtml } from './print-shared'

export type PrintableDeliverable =
  | { type: 'lab_order'; data: LabOrderData }
  | { type: 'prescription'; data: PrescriptionData }
  | { type: 'study_order'; data: StudyOrderData }

export function buildDeliverableHtml(deliverable: PrintableDeliverable) {
  switch (deliverable.type) {
    case 'lab_order':
      return buildLabOrderHtml(deliverable.data)
    case 'prescription':
      return buildPrescriptionHtml(deliverable.data)
    case 'study_order':
      return buildStudyOrderHtml(deliverable.data)
  }
}

// Imprime el entregable en hoja carta partida a la mitad (sin abrir otra pestaña).
export function printDeliverable(deliverable: PrintableDeliverable) {
  printHtml(buildDeliverableHtml(deliverable))
}

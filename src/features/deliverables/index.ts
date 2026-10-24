export { deliverablesKeys } from './hooks/deliverables.keys'
export { fetchDeliverablesByPatient } from './services/deliverables.service'
export { useDeliverablesByPatient } from './hooks/useDeliverablesByPatient'
export {
  useConsultationDrafts,
  usePrintConsultationDeliverable,
  useSaveLabOrder,
  useSavePrescription,
} from './hooks/useConsultationDeliverables'
export { printDeliverable } from './utils/print-deliverable'
// Piezas de impresión compartidas con otros reportes (p. ej. antropometría).
export { printHtml, escape as escapeHtml, logo as printLogo } from './utils/print-shared'
export { DeliverablesPanel } from './components/DeliverablesPanel'
export { DeliverablesSettingsPage } from './components/settings/DeliverablesSettingsPage'
export { fetchDeliverableTemplates } from './services/deliverable-templates.service'
export { DELIVERABLE_TYPE_LABELS } from './utils/deliverable-format'
export type {
  ConsultationDeliverableType,
  Deliverable,
  DeliverableType,
  LabOrderData,
  PrescriptionData,
  PrescriptionDraftItem,
} from './types'

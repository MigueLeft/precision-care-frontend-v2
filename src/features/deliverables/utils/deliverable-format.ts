import type { Deliverable, DeliverableType } from '../types'

export const DELIVERABLE_TYPE_LABELS: Record<DeliverableType, string> = {
  prescription: 'Receta',
  lab_order: 'Orden de lab',
  nutritional_report: 'Reporte',
  other: 'Otro',
}

// Título legible a partir del template + campos comunes del `data`.
export function formatDeliverableTitle(deliverable: Deliverable): string {
  const base = deliverable.templateName ?? 'Entregable'
  const data = deliverable.data
  const detail = data.title ?? data.name ?? data.subject
  return typeof detail === 'string' ? `${base} — ${detail}` : base
}

export function isViewableUrl(pdfS3Key: string | null): boolean {
  return !!pdfS3Key && /^https?:\/\//i.test(pdfS3Key)
}

import { LOGO_PATHS, LOGO_VIEWBOX } from '@/components/brand-logo-paths'
import { theme } from '@/utils/theme'
import type {
  ConsultationDeliverableType,
  DeliverableHeader,
  LabOrderData,
  PrescriptionData,
} from '../types'

const { palette } = theme

const escape = (value: string | null | undefined) =>
  (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'long' }) : ''

const logo = `<svg viewBox="${LOGO_VIEWBOX}" height="44" width="${(44 * 229) / 261}">
  <path d="${LOGO_PATHS.center}" fill="${palette.brand.dark}"/>
  <path d="${LOGO_PATHS.bottom}" fill="${palette.brand.accent}"/>
  <path d="${LOGO_PATHS.top}" fill="${palette.brand.accent}"/>
</svg>`

function headerHtml(title: string, data: DeliverableHeader) {
  return `
  <header>
    <div class="brand">${logo}<div><strong>PrecisionCare</strong><span>Sistema de Gestión Médica</span></div></div>
    <div class="doc"><h1>${escape(title)}</h1><span>${formatDate(data.date)}</span></div>
  </header>
  <section class="people">
    <div><label>Paciente</label><p>${escape(data.patient.name)}</p>
      <small>${data.patient.mrn ? `Expediente ${escape(data.patient.mrn)}` : ''}${
        data.patient.birthDate ? ` · Nacimiento ${formatDate(data.patient.birthDate)}` : ''
      }</small></div>
    <div><label>Médico</label><p>${escape(data.specialist.name)}</p>
      <small>${escape(data.specialist.specialty)}</small></div>
  </section>`
}

function labOrderBody(data: LabOrderData) {
  const rows = data.items
    .map(
      (item, i) =>
        `<tr><td>${i + 1}</td><td>${escape(item.name)}</td><td>${escape(item.loincCode)}</td><td>${escape(item.instructions)}</td></tr>`,
    )
    .join('')
  const title = data.title ? `<h2>${escape(data.title)}</h2>` : ''
  return `${title}<table><thead><tr><th>#</th><th>Estudio</th><th>LOINC</th><th>Indicaciones</th></tr></thead><tbody>${rows}</tbody></table>
  ${data.indications ? `<div class="notes"><label>Indicaciones generales</label><p>${escape(data.indications)}</p></div>` : ''}`
}

function prescriptionBody(data: PrescriptionData) {
  return data.items
    .map(
      (item, i) => `<div class="rx"><p><strong>${i + 1}. ${escape(item.name)}</strong></p>
      <p>${escape(item.dose)} · ${escape(item.frequency)} · durante ${escape(item.duration)}${
        item.route ? ` · vía ${escape(item.route)}` : ''
      }</p>${item.instructions ? `<small>${escape(item.instructions)}</small>` : ''}</div>`,
    )
    .join('')
}

const styles = `
  * { box-sizing: border-box; font-family: 'Montserrat', Arial, sans-serif; }
  body { margin: 32px; color: ${palette.text.primary}; font-size: 13px; }
  header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${palette.primary.main}; padding-bottom: 12px; }
  .brand { display: flex; gap: 10px; align-items: center; }
  .brand div { display: flex; flex-direction: column; }
  .brand strong { color: ${palette.brand.dark}; font-size: 18px; }
  .brand span, .doc span, small { color: ${palette.text.secondary}; font-size: 11px; }
  .doc { text-align: right; } h1 { margin: 0; font-size: 18px; color: ${palette.primary.main}; }
  .people { display: flex; gap: 32px; margin: 18px 0; }
  .people div { flex: 1; } label { display: block; font-size: 10px; text-transform: uppercase; color: ${palette.text.secondary}; }
  .people p { margin: 2px 0; font-weight: 600; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; } th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid ${palette.divider}; }
  th { font-size: 11px; color: ${palette.text.secondary}; }
  .rx { padding: 8px 0; border-bottom: 1px solid ${palette.divider}; } .rx p { margin: 2px 0; }
  .notes { margin-top: 16px; }
  h2 { font-size: 15px; margin: 0 0 8px; color: ${palette.brand.dark}; }
  .signature { margin-top: 72px; width: 260px; border-top: 1px solid ${palette.text.primary}; text-align: center; padding-top: 6px; }
`

const TITLES: Record<ConsultationDeliverableType, string> = {
  lab_order: 'Orden de laboratorio',
  prescription: 'Receta médica',
}

export function buildDeliverableHtml(
  type: ConsultationDeliverableType,
  data: LabOrderData | PrescriptionData,
) {
  const body =
    type === 'lab_order'
      ? labOrderBody(data as LabOrderData)
      : prescriptionBody(data as PrescriptionData)
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${TITLES[type]}</title>
  <style>${styles}</style></head><body>${headerHtml(TITLES[type], data)}${body}
  <div class="signature">${escape(data.specialist.name)}<br/><small>Firma</small></div></body></html>`
}

// Imprime el documento en un iframe oculto (sin abrir otra pestaña).
export function printDeliverable(
  type: ConsultationDeliverableType,
  data: LabOrderData | PrescriptionData,
) {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument
  if (!doc || !iframe.contentWindow) return
  doc.open()
  doc.write(buildDeliverableHtml(type, data))
  doc.close()
  iframe.contentWindow.focus()
  iframe.contentWindow.print()
  setTimeout(() => iframe.remove(), 1000)
}

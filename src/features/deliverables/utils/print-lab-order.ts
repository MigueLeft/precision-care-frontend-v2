import type { LabOrderData, LabOrderLine } from '../types'
import { baseStyles, chunk, escape, formatDay, lines, logo, palette, patientIdLine } from './print-shared'

// Orden de laboratorio en media carta, dos copias iguales en la hoja (una para
// el médico y otra para el paciente): membrete del laboratorio, "Favor realizar
// a" con los datos del paciente y los estudios solicitados.

const ITEMS_PER_SHEET = 30

function copy(data: LabOrderData, items: LabOrderLine[]) {
  const t = data.template ?? {}
  const idLine = patientIdLine(data.patient)
  const studies = items
    .map((item) => `<li><span class="box">✓</span>${escape(item.name)}${item.instructions ? ` <small>(${escape(item.instructions)})</small>` : ''}</li>`)
    .join('')
  return `<div class="half">
    <header class="lab">
      <div>${logo(42)}</div>
      <div class="lab-text">
        <strong>${escape(t.headerTitle ?? 'Orden de laboratorio')}</strong>
        ${t.headerSubtitle ? `<span>${escape(t.headerSubtitle)}</span>` : ''}
        ${t.headerLines ? `<small>${lines(t.headerLines)}</small>` : ''}
      </div>
    </header>
    <h1>${escape(t.documentTitle ?? 'ORDEN PARA EXÁMENES DE LABORATORIO')}</h1>
    <p class="field">Favor realizar a: <strong>${escape(data.patient.name)}</strong></p>
    ${idLine ? `<p class="field">${idLine}</p>` : ''}
    ${data.title ? `<h2>${escape(data.title)}</h2>` : ''}
    <ul class="grow">${studies}</ul>
    ${data.indications ? `<p class="notes"><strong>Indicaciones:</strong> ${escape(data.indications)}</p>` : ''}
    <div class="bottom">
      <p>Fecha: ${formatDay(data.date)}</p>
      <div class="sign">${escape(data.specialist.name)}<br/><small>Firma del médico</small></div>
    </div>
  </div>`
}

const styles = `
  .lab { display: flex; gap: 10px; align-items: center; }
  .lab-text { display: flex; flex-direction: column; text-align: center; flex: 1; }
  .lab-text strong { font-size: 13px; color: ${palette.brand.dark}; }
  .lab-text span { font-size: 11px; font-weight: 600; }
  .lab-text small { font-size: 8.5px; line-height: 1.3; }
  h1 { font-size: 14px; text-align: center; margin: 8px 0; padding-bottom: 4px; border-bottom: 2px solid ${palette.text.primary}; }
  h2 { font-size: 12px; margin: 6px 0 2px; color: ${palette.primary.main}; }
  .field { font-size: 12px; margin-bottom: 4px; }
  ul { list-style: none; padding: 0; margin: 6px 0 0; columns: 2; column-gap: 14px; font-size: 11px; }
  li { break-inside: avoid; margin-bottom: 3px; }
  .box { display: inline-block; width: 12px; height: 12px; border: 1px solid ${palette.text.primary}; font-size: 9px; line-height: 11px; text-align: center; margin-right: 5px; }
  .notes { font-size: 10.5px; margin-top: 6px; }
  .bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; }
  .sign { width: 180px; border-top: 1px solid ${palette.text.primary}; padding-top: 4px; text-align: center; font-size: 11px; }
`

export function buildLabOrderHtml(data: LabOrderData) {
  const sheets = chunk(data.items, ITEMS_PER_SHEET)
    .map((items) => `<div class="sheet">${copy(data, items)}${copy(data, items)}</div>`)
    .join('')
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Orden de laboratorio</title>
  <style>${baseStyles}${styles}</style></head><body>${sheets}</body></html>`
}

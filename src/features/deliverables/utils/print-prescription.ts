import type { PrescriptionData, PrescriptionLine } from '../types'
import { baseStyles, chunk, contactLine, escape, formatDay, lines, logo, palette, patientIdLine } from './print-shared'

// Récipe en media carta: a la izquierda el récipe (medicamentos con su
// presentación y dosis) y a la derecha las indicaciones para el paciente.

const ITEMS_PER_SHEET = 7

function letterhead(data: PrescriptionData) {
  const { specialist, patient } = data
  const idLine = patientIdLine(patient)
  return `
  <header class="lh">
    <div class="logo">${logo(40)}</div>
    <div class="lh-text">
      <h1>${escape(specialist.name)}</h1>
      ${specialist.titles ? `<p>${lines(specialist.titles)}</p>` : specialist.specialty ? `<p>${escape(specialist.specialty)}</p>` : ''}
      ${specialist.registrations ? `<p class="reg">${escape(specialist.registrations)}</p>` : ''}
    </div>
  </header>
  <section class="patient">
    <div><strong>${escape(patient.name)}</strong>${idLine ? `<br/><small>${idLine}</small>` : ''}</div>
    <div>Fecha: ${formatDay(data.date)}</div>
  </section>`
}

function footer(data: PrescriptionData) {
  const { specialist } = data
  const contact = contactLine(specialist)
  return `
  <footer>
    <div class="sign">${escape(specialist.name)}<br/><small>${escape(specialist.specialty)}</small></div>
    ${contact ? `<p class="contact">${contact}</p>` : ''}
  </footer>`
}

// Dosis, frecuencia y duración capturadas (lo que haya).
const doseLine = (item: PrescriptionLine) =>
  [item.dose, item.frequency, item.duration ? `por ${item.duration}` : '', item.route ? `vía ${item.route}` : '']
    .filter(Boolean)
    .map((part) => escape(part))
    .join(' · ')

function recipeHalf(data: PrescriptionData, items: PrescriptionLine[]) {
  const rows = items
    .map(
      (item) => `<div class="med"><div class="med-head"><strong>${escape(item.name)}</strong>
        <span>${escape(item.presentation)}</span></div>${doseLine(item) ? `<small>${doseLine(item)}</small>` : ''}</div>`,
    )
    .join('')
  const title = data.template?.recipeTitle ?? 'Récipe'
  return `<div class="half">${letterhead(data)}<h2>${escape(title)}</h2><div class="grow">${rows}</div>${footer(data)}</div>`
}

// Si la indicación ya nombra el medicamento ("Tomar 1 tableta de Metformina
// 850 mg ..."), se imprime tal cual; si no, precedida del nombre.
function indicationRow(item: PrescriptionLine) {
  const text = item.instructions || doseLine(item)
  const named = !!item.instructions && item.instructions.toLowerCase().includes(item.name.toLowerCase())
  return named
    ? `<p class="ind">${escape(text)}</p>`
    : `<p class="ind"><strong>${escape(item.name)}:</strong> ${escape(text)}</p>`
}

function indicationsHalf(data: PrescriptionData, items: PrescriptionLine[]) {
  const rows = items.map(indicationRow).join('')
  const title = data.template?.indicationsTitle ?? 'Indicaciones'
  return `<div class="half">${letterhead(data)}<h2>${escape(title)}</h2><div class="grow">${rows}</div>${footer(data)}</div>`
}

const styles = `
  .lh { display: flex; gap: 10px; align-items: center; border-bottom: 2px solid ${palette.primary.main}; padding-bottom: 6px; }
  .lh-text { flex: 1; text-align: center; }
  .lh h1 { margin: 0; font-size: 16px; color: ${palette.brand.dark}; }
  .lh p { font-size: 10.5px; } .lh .reg { font-weight: 600; margin-top: 2px; }
  .patient { display: flex; justify-content: space-between; margin: 10px 0 6px; font-size: 12px; }
  h2 { font-size: 13px; margin: 6px 0; color: ${palette.primary.main}; text-transform: uppercase; letter-spacing: 0.05em; }
  .med { padding: 5px 0; border-bottom: 1px solid ${palette.divider}; }
  .med-head { display: flex; justify-content: space-between; gap: 8px; }
  .ind { margin-bottom: 7px; line-height: 1.35; }
  footer { text-align: center; font-size: 10px; }
  .sign { margin: 0 auto 6px; width: 200px; border-top: 1px solid ${palette.text.primary}; padding-top: 4px; font-size: 11px; }
  .contact { color: ${palette.text.secondary}; }
`

export function buildPrescriptionHtml(data: PrescriptionData) {
  const sheets = chunk(data.items, ITEMS_PER_SHEET)
    .map((items) => `<div class="sheet">${recipeHalf(data, items)}${indicationsHalf(data, items)}</div>`)
    .join('')
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Récipe</title>
  <style>${baseStyles}${styles}</style></head><body>${sheets}</body></html>`
}

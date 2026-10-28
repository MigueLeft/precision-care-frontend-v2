import type { PrescriptionData, PrescriptionLine } from '../types'
import { baseStyles, chunk, escape, palette } from './print-shared'
import { letterhead, letterheadFooter, letterheadStyles } from './print-letterhead'

// Récipe en media carta: a la izquierda el récipe (medicamentos con su
// presentación y dosis) y a la derecha las indicaciones para el paciente.

const ITEMS_PER_SHEET = 7

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
  return `<div class="half">${letterhead(data)}<h2>${escape(title)}</h2><div class="grow">${rows}</div>${letterheadFooter(data)}</div>`
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
  return `<div class="half">${letterhead(data)}<h2>${escape(title)}</h2><div class="grow">${rows}</div>${letterheadFooter(data)}</div>`
}

const styles = `
  h2 { font-size: 13px; margin: 6px 0; color: ${palette.primary.main}; text-transform: uppercase; letter-spacing: 0.05em; }
  .med { padding: 5px 0; border-bottom: 1px solid ${palette.divider}; }
  .med-head { display: flex; justify-content: space-between; gap: 8px; }
  .ind { margin-bottom: 7px; line-height: 1.35; }
`

export function buildPrescriptionHtml(data: PrescriptionData) {
  const sheets = chunk(data.items, ITEMS_PER_SHEET)
    .map((items) => `<div class="sheet">${recipeHalf(data, items)}${indicationsHalf(data, items)}</div>`)
    .join('')
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Récipe</title>
  <style>${baseStyles}${letterheadStyles}${styles}</style></head><body>${sheets}</body></html>`
}

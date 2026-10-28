import type { StudyOrderData } from '../types'
import { baseStyles, escape, lines, palette } from './print-shared'
import { letterhead, letterheadFooter, letterheadStyles } from './print-letterhead'

// Orden de estudio en media carta (modelo EM7), dos copias iguales en la hoja:
// membrete del médico, paciente y fecha, a quién va dirigida (centro o
// especialista con dirección y teléfono) y "Favor practicar" con los estudios.

function recipient(data: StudyOrderData) {
  const provider = data.referralProvider
  if (!provider) return ''
  return `<section class="to">
    <strong>${escape(provider.name)}</strong>
    ${provider.specialty ? `<span>${escape(provider.specialty)}</span>` : ''}
    ${provider.address ? `<span>${lines(provider.address)}</span>` : ''}
    ${provider.phone ? `<span>${escape(provider.phone)}</span>` : ''}
  </section>`
}

function copy(data: StudyOrderData) {
  const label = data.template?.requestLabel ?? 'Favor practicar'
  const studies = data.items
    .map((item) => `<li>${escape(item.name)}${item.instructions ? ` <small>(${escape(item.instructions)})</small>` : ''}</li>`)
    .join('')
  return `<div class="half">${letterhead(data)}${recipient(data)}
    <div class="grow">
      <p class="request">${escape(label)}:</p>
      <ul>${studies}</ul>
      ${data.indications ? `<p class="notes"><strong>Indicaciones:</strong> ${escape(data.indications)}</p>` : ''}
    </div>
    ${letterheadFooter(data)}
  </div>`
}

const styles = `
  .to { display: flex; flex-direction: column; margin: 8px 0 12px; font-size: 11px; line-height: 1.35; }
  .to strong { font-size: 12.5px; }
  .to span { color: ${palette.text.secondary}; }
  .request { font-size: 13px; font-weight: 600; margin: 10px 0 4px; }
  ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.5; }
  .notes { font-size: 11px; margin-top: 10px; }
`

export function buildStudyOrderHtml(data: StudyOrderData) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Orden de estudio</title>
  <style>${baseStyles}${letterheadStyles}${styles}</style></head><body><div class="sheet">${copy(data)}${copy(data)}</div></body></html>`
}

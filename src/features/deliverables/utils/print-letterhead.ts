import type { DeliverableHeader } from '../types'
import { contactLine, escape, formatDay, lines, logo, palette, patientIdLine } from './print-shared'

// Membrete del especialista (récipe y orden de estudio): encabezado con sus
// títulos y registros, paciente con fecha, y firma con la dirección del consultorio.

export function letterhead(data: DeliverableHeader) {
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

export function letterheadFooter(data: DeliverableHeader) {
  const { specialist } = data
  const contact = contactLine(specialist)
  return `
  <footer>
    <div class="sign">${escape(specialist.name)}<br/><small>${escape(specialist.specialty)}</small></div>
    ${contact ? `<p class="contact">${contact}</p>` : ''}
  </footer>`
}

export const letterheadStyles = `
  .lh { display: flex; gap: 10px; align-items: center; border-bottom: 2px solid ${palette.primary.main}; padding-bottom: 6px; }
  .lh-text { flex: 1; text-align: center; }
  .lh h1 { margin: 0; font-size: 16px; color: ${palette.brand.dark}; }
  .lh p { font-size: 10.5px; } .lh .reg { font-weight: 600; margin-top: 2px; }
  .patient { display: flex; justify-content: space-between; margin: 10px 0 6px; font-size: 12px; }
  footer { text-align: center; font-size: 10px; }
  .sign { margin: 0 auto 6px; width: 200px; border-top: 1px solid ${palette.text.primary}; padding-top: 4px; font-size: 11px; }
  .contact { color: ${palette.text.secondary}; }
`

import type { Anthropometry } from '../../types'
import { anthropometryPage1 } from './anthropometry-report-page1'
import { anthropometryPage2 } from './anthropometry-report-page2'
import { rangeBarStyles } from './report-range-bar'
import {
  COLORS,
  esc,
  formatDateTime,
  infoGrid,
  num,
  reportFooter,
  reportHeader,
  reportStyles,
  SEX_LABELS,
  type ReportPatient,
} from './report-shared'

const FOOT = 'Los valores de referencia son orientativos y deben interpretarse por un profesional de la salud.'

// Reporte "Signos vitales y antropometría" (dos hojas carta).
export function buildAnthropometryReportHtml(patient: ReportPatient, row: Anthropometry) {
  const height = num(row.heightCm)
  const date = formatDateTime(row.assessmentDate)
  const page1 = `${reportHeader('Signos vitales y antropometría')}
    ${infoGrid([
      { label: 'Paciente', value: esc(patient.name), wide: true },
      { label: 'ID', value: esc(patient.mrn) },
      { label: 'Edad', value: patient.age !== null ? `${patient.age} años` : '—' },
      { label: 'Sexo', value: patient.sex ? SEX_LABELS[patient.sex] : '—' },
      { label: 'Altura', value: height !== null ? `${height.toFixed(0)} cm` : '—' },
      { label: 'Fecha / Hora', value: date },
    ])}
    ${anthropometryPage1(patient, row)}`
  const page2Header = `<header class="mini-head"><strong>Signos vitales y antropometría</strong>
    <span><b>${esc(patient.name)}</b> &nbsp; ${esc(patient.mrn)} &nbsp; ${date.split(' · ')[0]} &nbsp; Página 2 de 2</span></header>`

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Signos vitales y antropometría</title>
  <style>${reportStyles}${rangeBarStyles}${styles}</style></head><body>
  <section class="page"><main>${page1}</main>${reportFooter(FOOT)}</section>
  <section class="page"><main>${page2Header}${anthropometryPage2(row)}</main>${reportFooter(FOOT)}</section>
  </body></html>`
}

const styles = `
  .vitals { display: flex; border: 1px solid ${COLORS.border}; }
  .vital { flex: 1; padding: 9px 12px; border-left: 1px solid ${COLORS.border}; display: flex; flex-direction: column; gap: 3px; }
  .vital:first-child { border-left: 0; }
  .vital p { margin: 0; font-size: 11px; }
  .vital strong { font-size: 21px; }
  .vital .status { font-size: 10px; font-weight: 600; margin-top: 2px; }
  .measures td { padding: 7px 10px; }
  .measures .zone { text-align: center; width: 15%; }
  .measures .ref { color: ${COLORS.muted}; font-size: 10px; }
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
  .card { padding: 0 0 8px; }
  .card-title { margin: 0; padding: 7px 12px; background: #f6f8fb; font-size: 10px; font-weight: 600; color: ${COLORS.muted}; }
  .pair { display: flex; padding: 10px 12px 6px; }
  .pair > div { flex: 1; text-align: center; display: flex; flex-direction: column; gap: 3px; }
  .pair > div + div { border-left: 1px solid ${COLORS.border}; }
  .pair p { margin: 0; font-size: 11px; }
  .pair i { display: inline-block; width: 9px; height: 9px; margin-right: 5px; }
  .pair strong { font-size: 22px; }
  .split { display: flex; height: 10px; margin: 6px 12px 4px; }
  .card-foot { display: flex; justify-content: space-between; margin: 0; padding: 2px 12px; font-size: 9px; color: ${COLORS.muted}; }
  .row-line { display: flex; justify-content: space-between; margin: 6px 0 0; padding: 6px 12px; font-size: 10.5px; }
  .totals { display: flex; margin-top: 14px; }
  .totals > div { flex: 1; text-align: center; padding: 10px; border-left: 1px solid ${COLORS.border}; }
  .totals > div:first-child { border-left: 0; }
  .totals p { margin: 0 0 3px; font-size: 11px; }
  .totals strong { font-size: 20px; }
  .mini-head { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid ${COLORS.text}; padding-bottom: 8px; margin-bottom: 6px; }
  .mini-head strong { font-size: 15px; }
  .mini-head span { font-size: 10px; color: ${COLORS.muted}; }
  .mini-head b { color: ${COLORS.text}; }
  .two-cols { display: grid; grid-template-columns: 1fr 1.25fr; gap: 14px; align-items: start; }
  .sign-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-top: 22px; align-items: end; }
  .notes { padding: 10px 12px; min-height: 70px; }
  .notes p { margin: 0 0 4px; font-weight: 500; }
  .notes span { color: ${COLORS.muted}; white-space: pre-line; }
  .signature { border-top: 2px solid ${COLORS.text}; padding-top: 6px; }
  .signature p { margin: 0; font-size: 11px; }
`

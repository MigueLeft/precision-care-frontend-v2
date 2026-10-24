import { escapeHtml, printLogo } from '@/features/deliverables'
import { theme } from '@/utils/theme'
import type { Sex } from './body-silhouettes'

// Piezas comunes de los reportes de antropometría (hoja carta vertical).

export const { palette } = theme

export const COLORS = {
  text: palette.text.primary,
  muted: palette.text.secondary,
  border: palette.divider,
  accent: palette.primary.main,
  // Grasa en naranja (y "fuera de rango"); magra / agua en azules.
  fat: palette.warning.dark,
  lean: palette.primary.main,
  ok: palette.success.dark,
  water: palette.primary.light,
  calcBg: '#eef4fb',
  figure: '#c9d6e8',
  figureStroke: '#94a8c9',
}

export interface ReportPatient {
  name: string
  mrn: string
  age: number | null
  sex: Sex | null
}

export const esc = escapeHtml

// "12.30" (numeric de Postgres) → 12.3; vacío → null.
export function num(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export const fmt = (value: number | null, decimals = 1) => (value === null ? '—' : value.toFixed(decimals))

// Valor con unidad pequeña: "37.6 <small>kg</small>".
export const valueUnit = (value: number | null, unit: string, decimals = 1) =>
  value === null ? '—' : `<strong>${fmt(value, decimals)}</strong>${unit ? ` <small>${unit}</small>` : ''}`

export const SEX_LABELS: Record<Sex, string> = { male: 'Hombre', female: 'Mujer' }

export function formatDateTime(iso: string) {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function reportHeader(title: string) {
  return `<header class="report-head">
    <div><p class="eyebrow">REPORTE CLÍNICO</p><h1>${esc(title)}</h1></div>
    <div class="logo">${printLogo(46)}</div>
  </header>`
}

export function reportFooter(note: string, showOutOfRange = true) {
  return `<footer class="report-foot">
    <span><i class="swatch calc"></i>Valor calculado${showOutOfRange ? ' <i class="swatch out"></i>Fuera de rango' : ''}</span>
    <span>${esc(note)}</span>
  </footer>`
}

// Recuadro de datos del paciente (celdas etiqueta / valor).
export function infoGrid(cells: { label: string; value: string; calc?: boolean; wide?: boolean }[]) {
  return `<div class="info-grid">${cells
    .map(
      (cell) =>
        `<div class="cell${cell.calc ? ' calc' : ''}${cell.wide ? ' wide' : ''}"><small>${esc(cell.label)}</small><strong>${cell.value}</strong></div>`,
    )
    .join('')}</div>`
}

export const reportStyles = `
  @page { size: letter portrait; margin: 0.45in 0.5in; }
  * { box-sizing: border-box; font-family: 'IBM Plex Sans', 'Montserrat', Arial, sans-serif; }
  body { margin: 0; color: ${COLORS.text}; font-size: 11px; }
  .page { position: relative; min-height: 10in; display: flex; flex-direction: column; break-after: page; }
  .page:last-child { break-after: auto; }
  .page > main { flex: 1; }
  small { color: ${COLORS.muted}; font-weight: 400; font-size: 0.75em; }
  .report-head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid ${COLORS.text}; padding-bottom: 10px; margin-bottom: 16px; }
  .eyebrow { margin: 0; font-size: 10px; letter-spacing: 1.5px; font-weight: 600; color: ${COLORS.accent}; }
  h1 { margin: 2px 0 0; font-size: 22px; }
  h2 { font-size: 13px; margin: 16px 0 8px; }
  .info-grid { display: flex; border: 1px solid ${COLORS.border}; }
  .info-grid .cell { flex: 1; padding: 7px 10px; border-left: 1px solid ${COLORS.border}; display: flex; flex-direction: column; gap: 2px; }
  .info-grid .cell:first-child { border-left: 0; }
  .info-grid .cell.wide { flex: 2.2; }
  .info-grid .cell strong { font-size: 12.5px; font-weight: 500; white-space: nowrap; }
  .calc { background: ${COLORS.calcBg}; }
  .report-foot { display: flex; justify-content: space-between; border-top: 1px solid ${COLORS.border}; padding-top: 8px; margin-top: 18px; font-size: 9px; color: ${COLORS.muted}; }
  .swatch { display: inline-block; width: 12px; height: 9px; margin: 0 4px -1px 0; border: 1px solid ${COLORS.border}; }
  .swatch.calc { background: ${COLORS.calcBg}; }
  .swatch.out { background: ${COLORS.fat}; border-color: ${COLORS.fat}; margin-left: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 9.5px; font-weight: 600; color: ${COLORS.muted}; text-align: left; background: #f6f8fb; padding: 6px 10px; }
  td { padding: 6px 10px; border-top: 1px solid ${COLORS.border}; }
  .num { text-align: right; white-space: nowrap; }
  .num strong { font-size: 12.5px; }
  .box { border: 1px solid ${COLORS.border}; }
`

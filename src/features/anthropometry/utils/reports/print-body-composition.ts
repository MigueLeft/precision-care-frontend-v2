import type { Anthropometry, AnthropometrySegmentType } from '../../types'
import { SEGMENT_ANCHORS, silhouetteSvg, type Sex } from './body-silhouettes'
import {
  COLORS,
  esc,
  fmt,
  infoGrid,
  num,
  reportFooter,
  reportHeader,
  reportStyles,
  valueUnit,
  type ReportPatient,
} from './report-shared'

// Análisis de composición corporal (una hoja): silueta según el sexo, grasa y
// músculo por segmento, y totales. Solo con lo registrado en la antropometría.

// Área de la figura (px a 96 ppp: 7.5 × 6.25 in).
const W = 720
const FIG_X = 290
const FIG_Y = 10

function segmentOf(row: Anthropometry, segment: AnthropometrySegmentType) {
  return row.segments.find((s) => s.segment === segment)
}

// Recuadro de un segmento: grasa y músculo (tronco: masa magra).
function segmentBox(title: string, row: Anthropometry, segment: AnthropometrySegmentType, x: number, y: number) {
  const data = segmentOf(row, segment)
  const lean = segment === 'torso' ? 'Masa magra' : 'Músculo'
  return `<table class="seg box" style="left:${x}px;top:${y}px">
    <tr><th colspan="2">${esc(title)}</th></tr>
    <tr><td>Grasa</td><td class="num">${valueUnit(num(data?.fatMassKg), 'kg')}</td></tr>
    <tr><td>${lean}</td><td class="num">${valueUnit(num(data?.leanMassKg), 'kg')}</td></tr>
  </table>`
}

// Barra vertical apilada (de arriba hacia abajo) con alturas en %.
function stackedBar(x: number, parts: { pct: number; color: string }[]) {
  const segments = parts
    .filter((part) => part.pct > 0)
    .map((part) => `<div style="height:${part.pct}%;background:${part.color}"></div>`)
    .join('')
  return `<div class="bar" style="left:${x}px">${segments}</div>`
}

function legend(label: string, color: string, value: string, extra = '', calc = false) {
  return `<div class="legend"><p><i style="background:${color}"></i>${esc(label)}${calc ? ' <small>· calculado</small>' : ''}</p><strong>${value}</strong>${extra}</div>`
}

function figure(sex: Sex) {
  const a = SEGMENT_ANCHORS[sex]
  const at = ([x, y]: [number, number]) => [FIG_X + x, FIG_Y + y] as const
  const line = (from: readonly [number, number], to: readonly [number, number]) =>
    `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="${COLORS.text}" stroke-width="1"/>`
  const dot = (p: readonly [number, number]) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${COLORS.text}"/>`
  const points = [at(a.rightArm), at(a.leftArm), at(a.torso), at(a.rightLeg), at(a.leftLeg)]
  return `<svg class="figure" width="${W}" height="600" viewBox="0 0 ${W} 600">
    <g transform="translate(${FIG_X},${FIG_Y})">${silhouetteSvg(sex, COLORS.figure, COLORS.figureStroke)}</g>
    ${line([220, 62], points[0])}${line([500, 62], points[1])}
    ${line(points[2], [points[2][0], 500])}
    ${line([220, 478], points[3])}${line([500, 478], points[4])}
    ${points.map(dot).join('')}
  </svg>`
}

export function buildBodyCompositionHtml(patient: ReportPatient, row: Anthropometry) {
  const weight = num(row.weightKg)
  const height = num(row.heightCm)
  const fatKg = num(row.fatMassKg)
  const fatPct = num(row.fatMassPct)
  const leanKg = num(row.leanMassKg)
  const leanPct = num(row.leanMassPct)
  const waterKg = num(row.totalWaterKg)
  const waterPct = waterKg !== null && weight ? (waterKg / weight) * 100 : null
  const restKg = leanKg !== null && waterKg !== null ? Math.max(leanKg - waterKg, 0) : null
  const pctOf = (kg: number | null) => (kg !== null && weight ? (kg / weight) * 100 : 0)
  const sex: Sex = patient.sex ?? 'female'

  const body = `
    ${infoGrid([
      { label: 'Nombre', value: esc(patient.name), wide: true },
      { label: 'Edad', value: patient.age !== null ? `${patient.age} años` : '—' },
      { label: 'Peso', value: weight !== null ? `${fmt(weight)} kg` : '—' },
      { label: 'Talla', value: height !== null ? `${fmt(height / 100, 2)} m` : '—' },
      { label: 'IMC · calculado', value: row.bmi ? `${fmt(num(row.bmi))} kg/m²` : '—', calc: true },
    ])}
    <h2>Composición por segmento</h2>
    <div class="segments">
      ${figure(sex)}
      ${segmentBox('Brazo derecho', row, 'right_arm', 0, 0)}
      ${segmentBox('Brazo izquierdo', row, 'left_arm', 500, 0)}
      ${segmentBox('Pierna derecha', row, 'right_leg', 0, 432)}
      ${segmentBox('Pierna izquierda', row, 'left_leg', 500, 432)}
      ${segmentBox('Tronco', row, 'torso', 250, 500)}
      <div class="totals left" style="top:140px">
        ${legend('Grasa corporal total', COLORS.fat, `<span class="big">${valueUnit(fatKg, 'kg')}</span>`, fatPct !== null ? `<p class="pct">${fmt(fatPct)} %</p>` : '')}
      </div>
      <div class="totals left" style="top:342px">
        ${legend('Masa magra total', COLORS.lean, `<span class="big">${valueUnit(leanKg, 'kg')}</span>`, leanPct !== null ? `<p class="pct">${fmt(leanPct)} %</p>` : '')}
      </div>
      ${stackedBar(238, [{ pct: fatPct ?? 0, color: COLORS.fat }, { pct: leanPct ?? 0, color: COLORS.lean }])}
      ${stackedBar(460, [
        { pct: pctOf(fatKg), color: COLORS.fat },
        { pct: pctOf(waterKg), color: COLORS.lean },
        { pct: pctOf(restKg), color: COLORS.water },
      ])}
      <div class="totals right" style="top:140px">
        ${legend('Grasa corporal total', COLORS.fat, valueUnit(fatKg, 'kg'), fatPct !== null ? ` <small>· ${fmt(fatPct)} %</small>` : '')}
        ${legend('Agua total', COLORS.lean, valueUnit(waterKg, 'kg'), waterPct !== null ? ` <small>· ${fmt(waterPct)} %</small>` : '')}
        ${restKg !== null ? legend('Resto de masa magra', COLORS.water, valueUnit(restKg, 'kg'), ` <small>· ${fmt(pctOf(restKg))} %</small>`, true) : ''}
      </div>
    </div>`

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Análisis de composición corporal</title>
  <style>${reportStyles}${styles}</style></head><body>
  <section class="page"><main>${reportHeader('Análisis de composición corporal')}${body}</main>
  ${reportFooter('Los valores deben interpretarse por un profesional de la salud.', false)}</section>
  </body></html>`
}

const styles = `
  .segments { position: relative; width: ${W}px; height: 600px; margin-top: 4px; }
  .figure { position: absolute; left: 0; top: 0; }
  .seg { position: absolute; width: 220px; background: #fff; }
  .seg th { font-size: 10.5px; color: ${COLORS.text}; padding: 6px 10px; }
  .seg td { padding: 6px 10px; font-size: 11.5px; }
  .bar { position: absolute; top: 140px; width: 22px; height: 270px; display: flex; flex-direction: column; justify-content: flex-start; }
  .bar div { width: 100%; }
  .totals { position: absolute; width: 215px; }
  .totals.left { left: 0; }
  .totals.right { left: 495px; display: flex; flex-direction: column; gap: 22px; }
  .legend p { margin: 0 0 3px; font-weight: 600; font-size: 11px; }
  .legend i { display: inline-block; width: 10px; height: 10px; margin-right: 6px; }
  .legend strong { font-size: 15px; }
  .legend .big, .legend .big strong { font-size: 24px; }
  .legend .pct { margin: 2px 0 0; font-size: 12px; color: ${COLORS.muted}; }
`

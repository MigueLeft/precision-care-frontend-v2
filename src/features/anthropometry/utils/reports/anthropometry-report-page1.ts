import type { Anthropometry } from '../../types'
import { gripAsymmetryPct } from '../anthropometry-calculations'
import { BMI_RANGE, healthyWeightRange, sexRanges, statusOf, VITAL_RANGES, type Range } from './reference-ranges'
import { rangeBar } from './report-range-bar'
import { COLORS, esc, fmt, num, valueUnit, type ReportPatient } from './report-shared'

// Página 1 del reporte de antropometría: signos vitales, medidas con barras de
// referencia, composición, prensión y totales. Se omite lo no registrado.

const STATUS_TEXT = { low: 'Bajo', normal: 'Normal', high: 'Alto' } as const

function statusTag(value: number, range: Range) {
  const status = statusOf(value, range)
  const color = status === 'normal' ? COLORS.ok : COLORS.fat
  return `<p class="status" style="color:${color}">● ${STATUS_TEXT[status]}</p>`
}

function vitals(row: Anthropometry) {
  const sys = num(row.systolicBp)
  const dia = num(row.diastolicBp)
  const hr = num(row.heartRate)
  const sat = num(row.oxygenSaturation)
  const cards: string[] = []
  if (sys !== null && dia !== null) {
    const worst = statusOf(sys, VITAL_RANGES.systolic) !== 'normal' ? sys : dia
    const range = worst === sys ? VITAL_RANGES.systolic : VITAL_RANGES.diastolic
    cards.push(`<div class="vital"><p>Presión arterial</p><strong>${fmt(sys, 0)}/${fmt(dia, 0)}</strong><small>mmHg · Ref. &lt;120/80</small>${statusTag(worst, range)}</div>`)
  }
  if (hr !== null) cards.push(`<div class="vital"><p>Frec. cardiaca</p><strong>${fmt(hr, 0)} <small>lpm</small></strong><small>Ref. 60–100</small>${statusTag(hr, VITAL_RANGES.heartRate)}</div>`)
  if (sat !== null) cards.push(`<div class="vital"><p>Sat. de oxígeno</p><strong>${fmt(sat, 0)} <small>% SpO₂</small></strong><small>Ref. ≥ 95</small>${statusTag(sat, VITAL_RANGES.oxygenSaturation)}</div>`)
  return cards.length ? `<h2>Signos vitales</h2><div class="vitals">${cards.join('')}</div>` : ''
}

function measuresTable(patient: ReportPatient, row: Anthropometry) {
  const ranges = sexRanges(patient.sex)
  const items: { label: string; value: number | null; unit: string; range: Range | null; calc?: boolean; decimals?: number }[] = [
    { label: 'Altura', value: num(row.heightCm), unit: 'cm', range: null },
    { label: 'Peso', value: num(row.weightKg), unit: 'kg', range: healthyWeightRange(num(row.heightCm)) },
    { label: 'IMC', value: num(row.bmi), unit: 'kg/m²', range: BMI_RANGE, calc: true },
    { label: 'Circunferencia abdominal', value: num(row.abdominalCircCm), unit: 'cm', range: ranges.waist },
    { label: 'Circunferencia de cadera', value: num(row.hipCircCm), unit: 'cm', range: null },
    { label: 'Índice cintura-cadera', value: num(row.waistHipRatio), unit: '', range: ranges.waistHip, calc: true, decimals: 2 },
    { label: 'Circunferencia del cuello', value: num(row.neckCircCm), unit: 'cm', range: ranges.neck },
  ].filter((item) => item.value !== null)
  if (items.length === 0) return ''
  const rows = items
    .map(
      (item) => `<tr class="${item.calc ? 'calc' : ''}">
        <td>${esc(item.label)}${item.calc ? ' <small>· calculado</small>' : ''}</td>
        <td class="num"><strong>${fmt(item.value, item.decimals ?? 1)}</strong>${item.unit ? ` <small>${item.unit}</small>` : ''}</td>
        <td colspan="3">${rangeBar(item.value, item.range)}</td>
        <td class="num ref">${item.range?.label ?? '—'}</td>
      </tr>`,
    )
    .join('')
  return `<h2>Antropometría</h2><table class="box measures">
    <tr><th>Medida</th><th class="num">Valor</th><th class="zone">Bajo</th><th class="zone">Normal</th><th class="zone">Alto</th><th class="num">Referencia</th></tr>
    ${rows}</table>`
}

function compositionAndGrip(patient: ReportPatient, row: Anthropometry) {
  const fatPct = num(row.fatMassPct)
  const leanPct = num(row.leanMassPct)
  const right = num(row.gripRightKg)
  const left = num(row.gripLeftKg)
  const { fatPct: fatRange, grip } = sexRanges(patient.sex)
  const asymmetry = gripAsymmetryPct(right ?? undefined, left ?? undefined)
  const cards: string[] = []
  if (fatPct !== null) {
    const fatOut = fatRange && statusOf(fatPct, fatRange) !== 'normal'
    cards.push(`<div class="card box"><p class="card-title">Composición corporal</p><div class="pair">
      <div><p><i style="background:${COLORS.fat}"></i>Masa grasa</p><strong style="color:${fatOut ? COLORS.fat : COLORS.text}">${fmt(fatPct)} <small>%</small></strong><span>${valueUnit(num(row.fatMassKg), 'kg')}</span></div>
      <div><p><i style="background:${COLORS.lean}"></i>Masa magra</p><strong>${fmt(leanPct)} <small>%</small></strong><span>${valueUnit(num(row.leanMassKg), 'kg')}</span></div>
    </div><div class="split"><div style="width:${fatPct}%;background:${COLORS.fat}"></div><div style="flex:1;background:${COLORS.lean}"></div></div>
    <p class="card-foot"><span>${fatRange ? `Ref. grasa ${fatRange.label} %` : ''}</span><span>Peso ${valueUnit(num(row.weightKg), 'kg')}</span></p></div>`)
  }
  if (right !== null || left !== null) {
    cards.push(`<div class="card box"><p class="card-title">Fuerza de prensión manual</p><div class="pair">
      <div><p>Mano derecha</p><strong>${valueUnit(right, 'kg')}</strong></div>
      <div><p>Mano izquierda</p><strong>${valueUnit(left, 'kg')}</strong></div>
    </div>${asymmetry !== undefined ? `<p class="calc row-line"><span>Asimetría <small>· calculado</small></span><strong>${fmt(asymmetry)} %</strong></p>` : ''}
    <p class="card-foot"><span>${grip ? `Ref. ${grip.label} kg por mano` : ''}</span></p></div>`)
  }
  return cards.length ? `<div class="cards">${cards.join('')}</div>` : ''
}

function totals(row: Anthropometry) {
  const items = [
    { label: 'Agua total', value: num(row.totalWaterKg), unit: 'kg', decimals: 1 },
    { label: 'Masa muscular esquelética', value: num(row.skeletalMuscleMassKg), unit: 'kg', decimals: 1 },
    { label: 'Metabolismo basal', value: num(row.basalMetabolismKcal), unit: 'kcal', decimals: 0 },
  ].filter((item) => item.value !== null)
  return items.length
    ? `<div class="totals box">${items.map((item) => `<div><p>${item.label}</p><strong>${valueUnit(item.value, item.unit, item.decimals)}</strong></div>`).join('')}</div>`
    : ''
}

export function anthropometryPage1(patient: ReportPatient, row: Anthropometry) {
  return `${vitals(row)}${measuresTable(patient, row)}${compositionAndGrip(patient, row)}${totals(row)}`
}

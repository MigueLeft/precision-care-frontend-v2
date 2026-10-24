import type { Anthropometry, AnthropometrySegmentType } from '../../types'
import { esc, fmt, num, valueUnit } from './report-shared'

// Página 2 del reporte de antropometría: segmentos, pliegues y circunferencias
// del brazo, observaciones y firma. Se omite lo no registrado.

const SEGMENTS: { key: AnthropometrySegmentType; label: string }[] = [
  { key: 'torso', label: 'Torso' },
  { key: 'left_arm', label: 'Brazo izquierdo' },
  { key: 'right_arm', label: 'Brazo derecho' },
  { key: 'left_leg', label: 'Pierna izquierda' },
  { key: 'right_leg', label: 'Pierna derecha' },
]

function segmentsTable(row: Anthropometry) {
  const rows = SEGMENTS.map(({ key, label }) => ({ label, data: row.segments.find((s) => s.segment === key) }))
    .filter(({ data }) => data && [data.fatMassPct, data.fatMassKg, data.leanMassKg, data.skeletalMuscleMassKg, data.predictedMuscleMassKg].some((v) => v !== null))
  if (rows.length === 0) return ''
  const body = rows
    .map(
      ({ label, data }) => `<tr><td>${label}</td>
        <td class="num">${valueUnit(num(data?.fatMassPct ?? null), '%')}</td>
        <td class="num">${valueUnit(num(data?.fatMassKg ?? null), 'kg')}</td>
        <td class="num">${valueUnit(num(data?.leanMassKg ?? null), 'kg')}</td>
        <td class="num">${valueUnit(num(data?.skeletalMuscleMassKg ?? null), 'kg')}</td>
        <td class="num">${valueUnit(num(data?.predictedMuscleMassKg ?? null), 'kg')}</td></tr>`,
    )
    .join('')
  const mma = num(row.appendicularLeanMassKg)
  const mmaIndex = num(row.appendicularLeanMassIndex)
  return `<h2>Antropometría por segmento</h2><table class="box">
    <tr><th>Segmento</th><th class="num">Grasa %</th><th class="num">Grasa kg</th><th class="num">Masa magra</th><th class="num">Masa músculo esquelética</th><th class="num">Masa muscular prevista</th></tr>
    ${body}
    ${mma !== null ? `<tr class="calc"><td colspan="3"><strong>Masa magra apendicular</strong></td><td class="num">${valueUnit(mma, 'kg')}</td><td colspan="2"></td></tr>` : ''}
    ${mmaIndex !== null ? `<tr class="calc"><td colspan="3"><strong>Masa magra apendicular / altura²</strong></td><td class="num">${valueUnit(mmaIndex, 'kg/m²', 2)}</td><td colspan="2"></td></tr>` : ''}
  </table>`
}

function armTables(row: Anthropometry) {
  const circ = [
    { label: 'Circunferencia braquial', value: num(row.brachialCircCm), calc: false },
    { label: 'Circunferencia muscular del brazo', value: num(row.armMuscleCircCm), calc: true },
  ].filter((item) => item.value !== null)
  const folds = [
    { label: 'Pliegue tricipital', value: num(row.tricepsSkinfoldMm) },
    { label: 'Pliegue subescapular', value: num(row.subscapularSkinfoldMm) },
    { label: 'Pliegue abdominal', value: num(row.abdominalSkinfoldMm) },
    { label: 'Pliegue suprailiaco', value: num(row.suprailiacSkinfoldMm) },
    { label: 'Pliegue de muslo', value: num(row.thighSkinfoldMm) },
  ].filter((item) => item.value !== null)
  if (circ.length === 0 && folds.length === 0) return ''
  const sum = folds.reduce((total, item) => total + (item.value ?? 0), 0)
  const line = (label: string, value: number | null, unit: string, calc = false) =>
    `<tr class="${calc ? 'calc' : ''}"><td>${esc(label)}${calc ? ' <small>· calculado</small>' : ''}</td><td class="num"><strong>${fmt(value)}</strong> <small>${unit}</small></td></tr>`
  return `<h2>Pliegues y circunferencias del brazo</h2><div class="two-cols">
    ${circ.length ? `<table class="box"><tr><th>Circunferencia</th><th class="num">Valor</th></tr>${circ.map((c) => line(c.label, c.value, 'cm', c.calc)).join('')}</table>` : '<div></div>'}
    ${folds.length ? `<table class="box"><tr><th>Pliegue cutáneo</th><th class="num">Valor</th></tr>${folds.map((f) => line(f.label, f.value, 'mm')).join('')}${folds.length > 1 ? line('Suma de pliegues', sum, 'mm', true) : ''}</table>` : '<div></div>'}
  </div>`
}

export function anthropometryPage2(row: Anthropometry) {
  return `${segmentsTable(row)}${armTables(row)}
    <div class="sign-row">
      <div class="box notes"><p>Observaciones</p><span>${row.notes ? esc(row.notes) : 'Sin observaciones registradas.'}</span></div>
      <div class="signature"><p>Profesional responsable</p><small>Nombre, cédula y firma</small></div>
    </div>`
}

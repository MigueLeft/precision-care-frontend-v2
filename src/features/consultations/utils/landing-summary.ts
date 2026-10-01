import type { IntakeLandingCount, IntakeLandingResult } from '../types'

const LABELS: [keyof Omit<IntakeLandingResult, 'intakeResponseId'>, string][] = [
  ['symptoms', 'síntomas'],
  ['familyAntecedents', 'antecedentes familiares'],
  ['personalAntecedents', 'antecedentes personales'],
  ['surgeries', 'cirugías'],
  ['hospitalizations', 'hospitalizaciones'],
  ['medications', 'medicamentos'],
]

export function totalLanded(result: IntakeLandingResult): number {
  return LABELS.reduce((total, [key]) => total + result[key].added, 0)
}

// "3 síntomas · 2 cirugías": solo las categorías con registros nuevos.
export function describeLanding(result: IntakeLandingResult): string {
  return LABELS.map(([key, label]) => [result[key], label] as [IntakeLandingCount, string])
    .filter(([count]) => count.added > 0)
    .map(([count, label]) => `${count.added} ${label}`)
    .join(' · ')
}

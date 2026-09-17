import type { LifestyleComponentType } from '../types'

export const LIFESTYLE_COMPONENT_LABELS: Record<LifestyleComponentType, string> = {
  diet: 'Dieta',
  physical_activity: 'Actividad física',
  nicotine: 'Exposición a nicotina',
  sleep: 'Sueño',
  bmi: 'IMC',
  lipids: 'Lípidos',
  glucose: 'Glucosa',
  blood_pressure: 'Presión arterial',
}

// Orden de despliegue de las 8 tarjetas.
export const LIFESTYLE_COMPONENT_ORDER: LifestyleComponentType[] = [
  'diet',
  'physical_activity',
  'nicotine',
  'sleep',
  'bmi',
  'lipids',
  'glucose',
  'blood_pressure',
]

// Extrae una descripción legible del rawValue del componente (si la trae).
export function formatComponentDetail(
  rawValue: Record<string, unknown> | null,
): string | undefined {
  if (!rawValue) return undefined
  const note = rawValue.note ?? rawValue.description ?? rawValue.detail
  return typeof note === 'string' ? note : undefined
}

// Etiquetas de los scores del IM1 que se calculan pero no son uno de los 8
// componentes de Life's Essential 8 (destinationType==='custom' en
// intake_mapping — ver src/intakes/intake-scoring.service.ts). Ordenados por
// cómo aparecen en el cuestionario.
export const CLINICAL_RISK_SCORE_LABELS: Record<string, string> = {
  educacion_risk: 'Educación',
  macarthur_risk: 'Nivel socioeconómico (MacArthur)',
  antecedentes_familiares_risk: 'Antecedentes familiares',
  actividad_nivel: 'Nivel de actividad física',
  sqs_risk: 'Calidad de sueño (SQS)',
  nosas_risk: 'Riesgo de apnea del sueño (NoSAS)',
  gad7_risk: 'Ansiedad (GAD-7)',
  phq9_risk: 'Depresión (PHQ-9)',
  audit_c_risk: 'Alcohol (AUDIT-C)',
  tabaquismo_risk: 'Tabaquismo (ASSIST)',
  drogas_risk: 'Drogas (ASSIST)',
}

export const CLINICAL_RISK_SCORE_ORDER = Object.keys(CLINICAL_RISK_SCORE_LABELS)

// Verde = riesgo bajo, ámbar = intermedio/moderado, rojo = alto — a partir del
// texto de interpretation (range_interpretation.interpretation), que siempre
// incluye una de estas palabras. "alto" se evalúa primero para que
// "moderado-alto" caiga en rojo, no en ámbar.
export function riskTone(
  interpretation: string | null,
): 'success' | 'warning' | 'error' | undefined {
  if (!interpretation) return undefined
  const text = interpretation.toLowerCase()
  if (text.includes('alto') || text.includes('positivo')) return 'error'
  if (text.includes('intermedio') || text.includes('moderado')) return 'warning'
  if (text.includes('bajo') || text.includes('negativo')) return 'success'
  return undefined
}

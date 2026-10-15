import type { AnthropometryValueKey } from './types'

export interface AnthropometryParam {
  key: AnthropometryValueKey
  label: string
  unit: string
  // Calculado: no se captura a mano.
  calc?: boolean
  decimals?: number
  // Dirección "buena" del cambio, para colorear el delta vs. la medición anterior.
  betterWhen?: 'lower' | 'higher'
}

export interface AnthropometryGroup {
  id: string
  title: string
  params: AnthropometryParam[]
}

export const ANTHROPOMETRY_GROUPS: AnthropometryGroup[] = [
  {
    id: 'composition',
    title: 'Composición corporal',
    params: [
      { key: 'heightCm', label: 'Altura', unit: 'cm' },
      { key: 'weightKg', label: 'Peso', unit: 'kg' },
      { key: 'bmi', label: 'IMC', unit: 'kg/m²', calc: true, betterWhen: 'lower' },
      { key: 'fatMassPct', label: 'Masa grasa', unit: '%', betterWhen: 'lower' },
      { key: 'fatMassKg', label: 'Masa grasa', unit: 'kg', calc: true, betterWhen: 'lower' },
      { key: 'leanMassPct', label: 'Masa magra', unit: '%', calc: true, betterWhen: 'higher' },
      { key: 'leanMassKg', label: 'Masa magra', unit: 'kg', calc: true, betterWhen: 'higher' },
      { key: 'totalWaterKg', label: 'Agua total', unit: 'kg' },
      { key: 'basalMetabolismKcal', label: 'Metabolismo basal', unit: 'kcal' },
      {
        key: 'skeletalMuscleMassKg',
        label: 'Masa músculo esquelética',
        unit: 'kg',
        calc: true,
        betterWhen: 'higher',
      },
      {
        key: 'appendicularLeanMassKg',
        label: 'Masa magra apendicular',
        unit: 'kg',
        calc: true,
        betterWhen: 'higher',
      },
      {
        key: 'appendicularLeanMassIndex',
        label: 'Masa magra apendicular / talla²',
        unit: 'kg/m²',
        calc: true,
        decimals: 2,
        betterWhen: 'higher',
      },
    ],
  },
  {
    id: 'circumferences',
    title: 'Circunferencias',
    params: [
      { key: 'abdominalCircCm', label: 'Circunferencia abdominal', unit: 'cm', betterWhen: 'lower' },
      { key: 'hipCircCm', label: 'Circunferencia de cadera', unit: 'cm' },
      {
        key: 'waistHipRatio',
        label: 'Índice cintura-cadera',
        unit: '',
        calc: true,
        decimals: 2,
        betterWhen: 'lower',
      },
      { key: 'neckCircCm', label: 'Circunferencia del cuello', unit: 'cm' },
    ],
  },
  {
    id: 'grip',
    title: 'Fuerza de prensión',
    params: [
      { key: 'gripRightKg', label: 'Fuerza mano derecha', unit: 'kg', betterWhen: 'higher' },
      { key: 'gripLeftKg', label: 'Fuerza mano izquierda', unit: 'kg', betterWhen: 'higher' },
      {
        key: 'gripAsymmetryPct',
        label: 'Asimetría entre manos',
        unit: '%',
        calc: true,
        betterWhen: 'lower',
      },
    ],
  },
  {
    id: 'vitals',
    title: 'Signos vitales',
    params: [
      { key: 'systolicBp', label: 'Presión arterial sistólica', unit: 'mmHg', betterWhen: 'lower' },
      { key: 'diastolicBp', label: 'Presión arterial diastólica', unit: 'mmHg', betterWhen: 'lower' },
      { key: 'heartRate', label: 'Frecuencia cardíaca', unit: 'lpm', betterWhen: 'lower' },
      { key: 'oxygenSaturation', label: 'Saturación de oxígeno', unit: '%', betterWhen: 'higher' },
    ],
  },
  {
    id: 'skinfolds',
    title: 'Pliegues',
    params: [
      { key: 'brachialCircCm', label: 'Circunferencia braquial', unit: 'cm' },
      {
        key: 'armMuscleCircCm',
        label: 'Circunferencia muscular del brazo',
        unit: 'cm',
        calc: true,
      },
      { key: 'tricepsSkinfoldMm', label: 'Pliegue tricipital', unit: 'mm' },
      { key: 'subscapularSkinfoldMm', label: 'Pliegue subescapular', unit: 'mm' },
      { key: 'abdominalSkinfoldMm', label: 'Pliegue abdominal', unit: 'mm' },
      { key: 'suprailiacSkinfoldMm', label: 'Pliegue suprailiaco', unit: 'mm' },
      { key: 'thighSkinfoldMm', label: 'Pliegue de muslo', unit: 'mm' },
    ],
  },
]

// Todos los parámetros en orden (nota, nota evolutiva, histórico).
export const ANTHROPOMETRY_PARAMS: AnthropometryParam[] = ANTHROPOMETRY_GROUPS.flatMap(
  (group) => group.params,
)

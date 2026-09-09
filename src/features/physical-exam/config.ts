// Set fijo de 15 parámetros del examen físico. Los `calc` se derivan de peso,
// altura y grasa corporal y no se editan a mano.
export interface PhysicalExamParam {
  key: string
  label: string
  unit: string
  calc?: boolean
  // Dirección "buena" del cambio, para colorear el delta vs. el examen anterior.
  betterWhen?: 'lower' | 'higher'
}

export const PHYSICAL_EXAM_PARAMS: PhysicalExamParam[] = [
  { key: 'systolic_bp', label: 'Presión Arterial Sistólica', unit: 'mmHg', betterWhen: 'lower' },
  { key: 'diastolic_bp', label: 'Presión Arterial Diastólica', unit: 'mmHg', betterWhen: 'lower' },
  { key: 'heart_rate', label: 'Frecuencia Cardíaca', unit: 'lpm', betterWhen: 'lower' },
  { key: 'weight_kg', label: 'Peso', unit: 'kg' },
  { key: 'height_cm', label: 'Altura', unit: 'cm' },
  { key: 'bmi', label: 'Índice de Masa Corporal (IMC)', unit: 'kg/m²', calc: true, betterWhen: 'lower' },
  { key: 'body_fat_pct', label: 'Grasa Corporal', unit: '%', betterWhen: 'lower' },
  { key: 'body_fat_kg', label: 'Grasa Corporal', unit: 'kg', calc: true, betterWhen: 'lower' },
  { key: 'lean_mass_kg', label: 'Masa Magra', unit: 'kg', calc: true, betterWhen: 'higher' },
  { key: 'muscle_mass_kg', label: 'Masa Muscular', unit: 'kg', betterWhen: 'higher' },
  { key: 'abdominal_circ_cm', label: 'Circunferencia Abdominal', unit: 'cm', betterWhen: 'lower' },
  { key: 'neck_circ_cm', label: 'Circunferencia de Cuello', unit: 'cm' },
  { key: 'grip_right_kg', label: 'Fuerza Mano Derecha', unit: 'kg', betterWhen: 'higher' },
  { key: 'grip_left_kg', label: 'Fuerza Mano Izquierda', unit: 'kg', betterWhen: 'higher' },
  { key: 'oxygen_saturation', label: 'Saturación de Oxígeno', unit: '%', betterWhen: 'higher' },
]

// Rellena las filas calculadas a partir de las capturadas.
export function computePhysicalExam(
  values: Record<string, number | undefined>,
): Record<string, number | undefined> {
  const weight = values.weight_kg
  const height = values.height_cm
  const fatPct = values.body_fat_pct

  const bmi =
    weight && height ? Number((weight / (height / 100) ** 2).toFixed(1)) : undefined
  const bodyFatKg =
    weight && fatPct !== undefined
      ? Number(((weight * fatPct) / 100).toFixed(1))
      : undefined
  const leanMassKg =
    weight && bodyFatKg !== undefined
      ? Number((weight - bodyFatKg).toFixed(1))
      : undefined

  return {
    ...values,
    bmi,
    body_fat_kg: bodyFatKg,
    lean_mass_kg: leanMassKg,
  }
}

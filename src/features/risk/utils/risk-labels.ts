import type { FamilyDiabetes, FindriscCategory, RiskFactorAnswers, Severity, ValueSource } from '../types'

// Etiquetas propias equivalentes a los ítems del FINDRISC. PENDIENTE: confirmar
// permisos de uso (ADA y autores) antes de mostrar el texto literal del cuestionario.

export const RISK_DISCLAIMER =
  'Herramienta de apoyo a la decisión clínica; no reemplaza el juicio médico.'

export const FINDRISC_ITEM_LABELS: Record<string, string> = {
  age: 'Edad',
  bmi: 'IMC',
  waist: 'Cintura',
  physical_activity: 'Actividad física diaria (≥30 min)',
  fruit_vegetables: 'Frutas o verduras a diario',
  antihypertensive: 'Tratamiento antihipertensivo regular',
  high_glucose: 'Glucosa elevada alguna vez',
  family_diabetes: 'Familiar con diabetes',
}

export const FINDRISC_CATEGORY_LABELS: Record<FindriscCategory, string> = {
  low: 'Bajo',
  slightly_elevated: 'Ligeramente elevado',
  moderate: 'Moderado',
  high: 'Alto',
  very_high: 'Muy alto',
}

export const FINDRISC_CATEGORY_COLORS: Record<FindriscCategory, 'success' | 'info' | 'warning' | 'error'> = {
  low: 'success',
  slightly_elevated: 'info',
  moderate: 'warning',
  high: 'error',
  very_high: 'error',
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  normal: 'Normal',
  attention: 'Atención',
  high: 'Alto',
  critical: 'Crítico',
}

export const SEVERITY_COLORS: Record<Severity, 'success' | 'info' | 'warning' | 'error'> = {
  normal: 'success',
  attention: 'warning',
  high: 'error',
  critical: 'error',
}

export const FACTOR_LABELS: Record<string, string> = {
  blood_pressure: 'Presión arterial',
  ldl: 'LDL',
  fasting_glucose: 'Glucemia en ayunas',
  hba1c: 'HbA1c',
  smoking: 'Tabaquismo',
  bmi: 'IMC',
  waist: 'Cintura',
  family_premature_cvd: 'ECV prematura familiar',
  findrisc: 'FINDRISC',
}

// Nombre legible de cada variable del perfil (para "faltantes o vencidos").
export const PROFILE_FIELD_LABELS: Record<string, string> = {
  weightKg: 'Peso',
  heightCm: 'Talla',
  bmi: 'IMC',
  waistCm: 'Cintura',
  systolicBp: 'Presión sistólica',
  diastolicBp: 'Presión diastólica',
  totalCholesterolMgDl: 'Colesterol total',
  ldlMgDl: 'LDL',
  fastingGlucoseMgDl: 'Glucemia en ayunas',
  hba1cPct: 'HbA1c',
  hdlMgDl: 'HDL',
  creatinineMgDl: 'Creatinina',
  egfr: 'eGFR (creatinina)',
  uacrMgG: 'Albúmina/creatinina en orina',
  statinUse: 'Estatina',
  diabetesDiagnosed: 'Diabetes diagnosticada',
  priorCvd: 'Enfermedad cardiovascular previa',
  currentSmoker: 'Tabaquismo',
  antihypertensiveUse: 'Antihipertensivos',
  physicalActivityDaily: 'Actividad física',
  dailyFruitVegetables: 'Frutas o verduras',
  highGlucoseEver: 'Glucosa elevada alguna vez',
  familyDiabetes: 'Familiar con diabetes',
  familyPrematureCvd: 'ECV prematura familiar',
}

export const SOURCE_LABELS: Record<ValueSource, string> = {
  measured: 'medido',
  lab: 'laboratorio',
  self_reported: 'IM1',
  confirmed: 'confirmado',
  derived: 'inferido',
}

export const FAMILY_DIABETES_LABELS: Record<FamilyDiabetes, string> = {
  none: 'No',
  second_degree: '2.º grado',
  first_degree: '1.er grado',
}

// Preguntas del formulario de la consulta (sí/no/sin dato).
export const CONFIRMATION_QUESTIONS: { key: Exclude<keyof RiskFactorAnswers, 'familyDiabetes'>; label: string }[] = [
  { key: 'diabetesDiagnosed', label: 'Diabetes diagnosticada' },
  { key: 'priorCvd', label: 'Infarto o ACV previo' },
  { key: 'currentSmoker', label: 'Fuma actualmente' },
  { key: 'antihypertensiveUse', label: 'Toma antihipertensivos de forma regular' },
  { key: 'statinUse', label: 'Toma estatina' },
  { key: 'physicalActivityDaily', label: 'Actividad física ≥30 min al día' },
  { key: 'dailyFruitVegetables', label: 'Come frutas o verduras a diario' },
  { key: 'highGlucoseEver', label: 'Glucosa elevada alguna vez' },
  { key: 'familyPrematureCvd', label: 'ECV prematura en familiar de 1.er grado (H <55, M <65)' },
]

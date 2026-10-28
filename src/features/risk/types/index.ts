// Respuesta de GET /risk/patient/:id (debe coincidir con src/risk del backend).
import type { Cha2ds2Calculation, PceResult, PreventResult } from './cardio'

export type * from './cardio'

export type ValueSource = 'measured' | 'lab' | 'self_reported' | 'confirmed' | 'derived'

export interface ProfileValue<T> {
  value: T
  unit: string | null
  date: string | null
  source: ValueSource
  // Fórmula de un valor derivado (p. ej. 'ckd-epi-2021' para el eGFR).
  formulaVersion?: string
}

export type FamilyDiabetes = 'none' | 'second_degree' | 'first_degree'
export type PceRace = 'white' | 'african_american' | 'other'

export interface ProfileGap {
  field: string
  reason: 'missing' | 'expired'
}

export interface ClinicalProfile {
  evaluationDate: string
  sex: 'male' | 'female' | null
  ageYears: number | null
  bmi: ProfileValue<number> | null
  waistCm: ProfileValue<number> | null
  systolicBp: ProfileValue<number> | null
  diastolicBp: ProfileValue<number> | null
  totalCholesterolMgDl: ProfileValue<number> | null
  ldlMgDl: ProfileValue<number> | null
  fastingGlucoseMgDl: ProfileValue<number> | null
  hba1cPct: ProfileValue<number> | null
  hdlMgDl: ProfileValue<number> | null
  nonHdlMgDl: ProfileValue<number> | null
  creatinineMgDl: ProfileValue<number> | null
  egfr: ProfileValue<number> | null
  uacrMgG: ProfileValue<number> | null
  diabetesDiagnosed: ProfileValue<boolean> | null
  priorCvd: ProfileValue<boolean> | null
  currentSmoker: ProfileValue<boolean> | null
  antihypertensiveUse: ProfileValue<boolean> | null
  glucoseLoweringUse: ProfileValue<boolean> | null
  statinUse: ProfileValue<boolean> | null
  pceRace: ProfileValue<PceRace> | null
  atrialFibrillation: ProfileValue<boolean> | null
  heartFailure: ProfileValue<boolean> | null
  hypertensionDx: ProfileValue<boolean> | null
  strokeTiaThromboembolism: ProfileValue<boolean> | null
  vascularDisease: ProfileValue<boolean> | null
  mitralStenosisModSevere: ProfileValue<boolean> | null
  mechanicalValve: ProfileValue<boolean> | null
  physicalActivityDaily: ProfileValue<boolean> | null
  dailyFruitVegetables: ProfileValue<boolean> | null
  highGlucoseEver: ProfileValue<boolean> | null
  familyDiabetes: ProfileValue<FamilyDiabetes> | null
  familyPrematureCvd: ProfileValue<boolean> | null
  gaps: ProfileGap[]
}

export interface EngineWarning {
  code: string
  message: string
}

export type FindriscCategory = 'low' | 'slightly_elevated' | 'moderate' | 'high' | 'very_high'

export interface FindriscItem {
  item: string
  value: number | boolean | string | null
  points: number | null
  min: number
  max: number
}

export type FindriscResult =
  | { status: 'not_applicable'; reason: string; warnings: EngineWarning[]; rulesVersion: string }
  | {
      status: 'complete' | 'incomplete'
      score: number | null
      range: [number, number]
      category: FindriscCategory | null
      referral: boolean
      items: FindriscItem[]
      warnings: EngineWarning[]
      rulesVersion: string
      variant: 'LA' | 'original'
    }

export type GloboriskAssessment =
  | {
      status: 'not_applicable' | 'not_calculated'
      reason: string
      warnings: EngineWarning[]
      policyVersion: string
    }
  | {
      status: 'calculated'
      risk: number
      version: 'lab' | 'office' | 'fatal'
      coefficients: 'lac' | 'original'
      baseYear: number
      warnings: EngineWarning[]
      policyVersion: string
    }

export type Severity = 'normal' | 'attention' | 'high' | 'critical'

export interface RiskFinding {
  factor: string
  value: string
  severity: Severity
  rule: string
  action: string | null
}

export interface RiskProfileResult {
  findings: RiskFinding[]
  majorAltered: number
  gaps: ProfileGap[]
  rulesVersion: string
}

export interface RiskFactorAnswers {
  diabetesDiagnosed?: boolean | null
  priorCvd?: boolean | null
  currentSmoker?: boolean | null
  antihypertensiveUse?: boolean | null
  physicalActivityDaily?: boolean | null
  dailyFruitVegetables?: boolean | null
  highGlucoseEver?: boolean | null
  familyDiabetes?: FamilyDiabetes | null
  familyPrematureCvd?: boolean | null
  statinUse?: boolean | null
  atrialFibrillation?: boolean | null
  heartFailure?: boolean | null
  hypertensionDx?: boolean | null
  strokeTiaThromboembolism?: boolean | null
  vascularDisease?: boolean | null
  mitralStenosisModSevere?: boolean | null
  mechanicalValve?: boolean | null
}

export interface RiskOverview {
  profile: ClinicalProfile
  assessment: {
    diabetes: boolean | null
    findrisc: FindriscResult
    globorisk: GloboriskAssessment | null
    riskProfile: RiskProfileResult
    // Comparativo AHA; Globorisk sigue siendo el principal.
    prevent: PreventResult
    // Heredada: solo con includeLegacyPce.
    pce: PceResult | null
  }
  confirmation: RiskFactorAnswers | null
  referralThreshold: number
  referralStudies: { id: number; name: string }[]
}

export interface RiskCalculation {
  id: number
  kind: 'findrisc' | 'globorisk' | 'risk_profile' | 'prevent' | 'pce' | 'cha2ds2_vasc' | 'cha2ds2_va'
  status: string
  evaluationDate: string
  result: FindriscResult | GloboriskAssessment | RiskProfileResult | PreventResult | PceResult | Cha2ds2Calculation
  algorithmVersion: string
  parametersVersion: string | null
  trigger: string
  supersededAt: string | null
  createdAt: string
}

// PREVENT, PCE y CHA2DS2 (deben coincidir con src/risk/engines del backend).
import type { EngineWarning, ValueSource } from './index'

export type PreventOutcome = 'total_cvd' | 'ascvd' | 'heart_failure'
export type PreventRisks = Record<PreventOutcome, number | null>
export type AscvdCategory = 'low' | 'borderline' | 'intermediate' | 'high'

export type PreventResult =
  | {
      status: 'not_applicable' | 'not_calculated' | 'incomplete'
      reason: string
      warnings: EngineWarning[]
      policyVersion: string
    }
  | {
      status: 'calculated'
      model: string
      // Fracción 0–1.
      risk10yr: PreventRisks
      risk30yr: PreventRisks | null
      ascvd10yrCategory: AscvdCategory | null
      bpDrugThresholdMet: boolean | null
      attribution: string
      warnings: EngineWarning[]
      policyVersion: string
    }

export type PceCategory = 'low' | 'borderline' | 'intermediate' | 'high'

export type PceResult =
  | { status: 'not_applicable' | 'incomplete'; reason: string; warnings: EngineWarning[]; policyVersion: string }
  | {
      status: 'calculated'
      ascvd10yr: number
      category: PceCategory
      equation: string
      warnings: EngineWarning[]
      policyVersion: string
    }

export type Cha2ds2Variant = 'vasc' | 'va'
export type AnticoagulationRecommendation = 'recommended' | 'reasonable' | 'consider' | 'not_recommended'

export interface Cha2ds2Item {
  item: 'C' | 'H' | 'A2' | 'D' | 'S2' | 'V' | 'A' | 'Sc'
  points: number | null
  min: number
  max: number
  source: ValueSource | null
}

export interface Cha2ds2VariantResult {
  variant: Cha2ds2Variant
  status: 'complete' | 'incomplete'
  score: number | null
  range: [number, number]
  items: Cha2ds2Item[]
  annualStrokeRatePct: number | null
  recommendation: AnticoagulationRecommendation | null
  guideline: string
  algorithmVersion: string
  warnings: EngineWarning[]
}

export type Cha2ds2Assessment =
  | { status: 'not_applicable'; reason: string; warnings: EngineWarning[]; policyVersion: string }
  | {
      status: 'evaluated'
      primaryVariant: Cha2ds2Variant
      vasc: Cha2ds2VariantResult
      va: Cha2ds2VariantResult
      warnings: EngineWarning[]
      legend: string
      policyVersion: string
    }

// Fila de risk_calculation de una variante (resultado con la variante principal marcada).
export type Cha2ds2Calculation =
  | (Cha2ds2VariantResult & { primary: boolean; legend: string; policyVersion: string })
  | Extract<Cha2ds2Assessment, { status: 'not_applicable' }>

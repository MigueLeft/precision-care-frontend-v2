import type {
  Cha2ds2Calculation,
  FindriscResult,
  GloboriskAssessment,
  PceResult,
  PreventResult,
  RiskCalculation,
  RiskProfileResult,
} from '../types'
import { percent } from './cardio-labels'

// Valor numérico de un cálculo para la tendencia (null si no hay puntaje) y su
// texto para la tabla del histórico.

export function calculationValue(calc: RiskCalculation): number | null {
  switch (calc.kind) {
    case 'findrisc': {
      const r = calc.result as FindriscResult
      return r.status === 'complete' ? r.score : null
    }
    case 'globorisk': {
      const r = calc.result as GloboriskAssessment
      return r.status === 'calculated' ? r.risk * 100 : null
    }
    case 'prevent': {
      const r = calc.result as PreventResult
      return r.status === 'calculated' && r.risk10yr.total_cvd !== null ? r.risk10yr.total_cvd * 100 : null
    }
    case 'pce': {
      const r = calc.result as PceResult
      return r.status === 'calculated' ? r.ascvd10yr * 100 : null
    }
    case 'cha2ds2_vasc':
    case 'cha2ds2_va': {
      const r = calc.result as Cha2ds2Calculation
      return r.status === 'complete' ? r.score : null
    }
    default:
      return (calc.result as RiskProfileResult).majorAltered
  }
}

export function calculationText(calc: RiskCalculation): string {
  switch (calc.kind) {
    case 'findrisc': {
      const r = calc.result as FindriscResult
      if (r.status === 'not_applicable') return 'No aplica'
      return r.status === 'complete' ? `${r.score} pts` : `${r.range[0]}–${r.range[1]} (incompleto)`
    }
    case 'globorisk': {
      const r = calc.result as GloboriskAssessment
      return r.status === 'calculated' ? `${percent(r.risk)} (${r.version}, ${r.baseYear})` : 'No calculado'
    }
    case 'prevent': {
      const r = calc.result as PreventResult
      if (r.status !== 'calculated') return r.status === 'incomplete' ? 'Incompleto' : 'No aplica'
      return `ECV ${percent(r.risk10yr.total_cvd)} · ASCVD ${percent(r.risk10yr.ascvd)} (10 años)`
    }
    case 'pce': {
      const r = calc.result as PceResult
      if (r.status !== 'calculated') return r.status === 'incomplete' ? 'Incompleto' : 'No aplica'
      return `ASCVD ${percent(r.ascvd10yr)} (10 años)`
    }
    case 'cha2ds2_vasc':
    case 'cha2ds2_va': {
      const r = calc.result as Cha2ds2Calculation
      if (r.status === 'not_applicable') return 'No aplica'
      return r.status === 'complete' ? `${r.score} pts` : `${r.range[0]}–${r.range[1]} (incompleto)`
    }
    default:
      return `${(calc.result as RiskProfileResult).majorAltered} mayores alterados`
  }
}

import { VITAL_THRESHOLDS } from '../config'
import type { AlteredVital } from '../types'

// Signos vitales registrados en la consulta (antropometría); llegan como texto.
export interface RecordedVitals {
  systolicBp: string | null
  diastolicBp: string | null
  heartRate: string | null
  oxygenSaturation: string | null
}

const num = (value: string | null) => (value == null || value === '' ? null : Number(value))

// Los que están fuera de los umbrales configurados.
export function alteredVitals(vitals: RecordedVitals | null | undefined, t = VITAL_THRESHOLDS): AlteredVital[] {
  if (!vitals) return []
  const result: AlteredVital[] = []
  const sys = num(vitals.systolicBp)
  const dia = num(vitals.diastolicBp)
  const hr = num(vitals.heartRate)
  const sat = num(vitals.oxygenSaturation)
  if ((sys !== null && sys >= t.systolicMax) || (dia !== null && dia >= t.diastolicMax)) {
    result.push({ label: 'PA', value: `${sys ?? '—'}/${dia ?? '—'} mmHg` })
  }
  if (hr !== null && (hr < t.heartRateMin || hr > t.heartRateMax)) result.push({ label: 'FC', value: `${hr} lpm` })
  if (sat !== null && sat < t.oxygenSaturationMin) result.push({ label: 'SatO₂', value: `${sat} %` })
  return result
}

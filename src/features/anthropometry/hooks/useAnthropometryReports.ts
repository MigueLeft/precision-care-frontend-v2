import { printHtml } from '@/features/deliverables'
import { calculatePatientAge, formatPatientName, usePatient } from '@/features/patients'
import { toast } from '@/utils/toast'
import type { Anthropometry } from '../types'
import { buildAnthropometryReportHtml } from '../utils/reports/print-anthropometry-report'
import { buildBodyCompositionHtml } from '../utils/reports/print-body-composition'
import type { ReportPatient } from '../utils/reports/report-shared'

export type AnthropometryReportKind = 'body_composition' | 'anthropometry'

export const ANTHROPOMETRY_REPORT_LABELS: Record<AnthropometryReportKind, string> = {
  body_composition: 'Análisis de composición corporal',
  anthropometry: 'Signos vitales y antropometría',
}

// Imprime los reportes de una medición con los datos del paciente.
export function useAnthropometryReports(patientId: number) {
  const { data: patient } = usePatient(patientId)

  function print(kind: AnthropometryReportKind, row: Anthropometry) {
    if (!patient) {
      toast.error('Aún se están cargando los datos del paciente. Intenta de nuevo.')
      return
    }
    const reportPatient: ReportPatient = {
      name: formatPatientName(patient),
      mrn: patient.mrn,
      age: patient.birthDate ? calculatePatientAge(patient.birthDate) : null,
      sex: patient.sex ?? null,
    }
    printHtml(
      kind === 'body_composition'
        ? buildBodyCompositionHtml(reportPatient, row)
        : buildAnthropometryReportHtml(reportPatient, row),
    )
  }

  return { print, ready: !!patient }
}

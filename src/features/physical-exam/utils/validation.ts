import { MANDATORY_SYSTEMS, OTHER_REASON, PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { PhysicalExam, SectionConfig, SectionData, SystemConfig } from '../types'
import { sectionsOf } from './config-lookup'

// Validación del examen físico: lista de avisos por sistema (código → avisos).
// Solo avisan; no bloquean el cierre de la consulta.

export type ExamErrors = Record<string, string[]>

// "Otro" exige texto: se guarda como "Otro: <texto>".
export function isReasonComplete(motivo: string | null): boolean {
  if (!motivo) return false
  if (motivo === OTHER_REASON || motivo.startsWith(`${OTHER_REASON}:`)) {
    return motivo.slice(OTHER_REASON.length + 1).trim().length > 0
  }
  return true
}

function sectionErrors(config: SectionConfig, data: SectionData): string[] {
  const errors: string[] = []
  for (const element of config.elements) {
    const elementData = data.elementos.find((e) => e.codigo === element.code)
    if (!elementData || elementData.estado !== 'A') continue
    const hasValues = element.control && Object.keys(elementData.valores).length > 0
    if (elementData.hallazgos.length === 0 && !elementData.nota?.trim() && !hasValues) {
      errors.push(`${element.label}: agrega un hallazgo o una nota.`)
    }
    if (element.paired && elementData.hallazgos.some((h) => !h.atributos.lateralidad)) {
      errors.push(`${element.label}: indica la lateralidad de cada hallazgo.`)
    }
  }
  return errors
}

function systemErrors(config: SystemConfig, exam: PhysicalExam, mandatory: string[]): string[] {
  const data = exam.sistemas.find((s) => s.codigo === config.code)
  if (!data) return []
  if (data.estado === 'SIN_DOCUMENTAR') {
    return mandatory.includes(config.code) ? ['Sistema obligatorio sin documentar.'] : []
  }
  if (data.estado === 'NO_EXAMINADO' || data.estado === 'DIFERIDO') {
    return isReasonComplete(data.motivo) ? [] : ['Indica el motivo (si es "Otro", escríbelo).']
  }
  const sections = sectionsOf(config, data)
  const errors = sections.flatMap(({ config: sub, data: subData }) => sectionErrors(sub, subData))
  const anyAbnormal = sections.some(({ data: d }) => d.elementos.some((e) => e.estado === 'A'))
  if (data.estado === 'ANORMAL' && !anyAbnormal) errors.unshift('Marca qué elemento es anormal (A).')
  return errors
}

export function validateExam(
  exam: PhysicalExam,
  systems = PHYSICAL_EXAM_SYSTEMS,
  mandatory = MANDATORY_SYSTEMS,
): ExamErrors {
  const result: ExamErrors = {}
  for (const config of systems) {
    const errors = systemErrors(config, exam, mandatory)
    if (errors.length) result[config.code] = errors
  }
  return result
}

export const countErrors = (errors: ExamErrors) => Object.values(errors).reduce((n, list) => n + list.length, 0)

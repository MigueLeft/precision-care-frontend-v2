import { PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { AlteredVital, ElementPath, PhysicalExam, SystemData, SystemState } from '../types'
import { elementConfig, findElement, sectionsOf, systemConfig } from './config-lookup'

// Reglas que se aplican después de cada cambio del formulario.

export interface ExamContext {
  // Signos vitales fuera de rango de la antropometría de esta consulta.
  alteredVitals: AlteredVital[]
}

export const EMPTY_CONTEXT: ExamContext = { alteredVitals: [] }

const VITALS_PATH: ElementPath = { system: 'GENERAL', element: 'SIGNOS_VITALES' }
const VITALS_FINDING = 'SV_ALTERADOS'

const vitalsText = (vitals: AlteredVital[]) => vitals.map((v) => `${v.label} ${v.value}`).join(', ')

// Con signos vitales fuera de rango, "Signos vitales" no puede quedar en N:
// pasa a A con los valores alterados.
function applyVitals(exam: PhysicalExam, ctx: ExamContext) {
  const element = findElement(exam, VITALS_PATH)
  if (!element || ctx.alteredVitals.length === 0 || element.estado === 'NE') return
  const values = vitalsText(ctx.alteredVitals)
  element.estado = 'A'
  const existing = element.hallazgos.find((h) => h.codigo === VITALS_FINDING)
  if (existing) existing.atributos.valores = values
  else element.hallazgos.push({ codigo: VITALS_FINDING, atributos: { valores: values } })
}

const ABNORMAL_WINS: SystemState[] = ['NORMAL', 'SIN_DOCUMENTAR']

// Un elemento en A vuelve anormal su bloque; un bloque en Normal no puede
// tener elementos en A. ORL deriva su estado de los subapartados; en
// Genitourinario la variante sigue al sistema.
function applySystem(system: SystemData) {
  const config = systemConfig(system.codigo)
  if (!config) return
  for (const { data } of sectionsOf(config, system)) {
    if (data.elementos.some((e) => e.estado === 'A') && ABNORMAL_WINS.includes(data.estado)) data.estado = 'ANORMAL'
  }
  if (config.subsections) {
    if (system.subapartados.some((s) => s.estado === 'ANORMAL')) system.estado = 'ANORMAL'
  } else if (config.variants) {
    const variant = system.subapartados[0]
    if (variant?.estado === 'ANORMAL') system.estado = 'ANORMAL'
    else if (variant) variant.estado = system.estado
  }
}

export function finalizeExam(exam: PhysicalExam, ctx: ExamContext): PhysicalExam {
  applyVitals(exam, ctx)
  exam.sistemas.forEach(applySystem)
  return exam
}

// Copia un elemento compartido a su gemelo del otro sistema.
export function mirrorShared(exam: PhysicalExam, path: ElementPath, systems = PHYSICAL_EXAM_SYSTEMS) {
  const twin = elementConfig(path, systems)?.sharedWith
  const source = findElement(exam, path)
  if (!twin || !source) return
  const target = findElement(exam, { system: twin.system, element: twin.element })
  if (!target) return
  target.estado = source.estado
  target.valores = structuredClone(source.valores)
  target.hallazgos = structuredClone(source.hallazgos)
  target.nota = source.nota
}

// Aplica un cambio sobre una copia y deja el examen consistente.
export function editExam(exam: PhysicalExam, ctx: ExamContext, change: (draft: PhysicalExam) => void): PhysicalExam {
  const draft = structuredClone(exam)
  change(draft)
  return finalizeExam(draft, ctx)
}

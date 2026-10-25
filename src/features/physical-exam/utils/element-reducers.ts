import type { AttrValue, ElementData, ElementPath, ElementState, PhysicalExam } from '../types'
import { elementConfig, findElement } from './config-lookup'
import { defaultValues, hasAbnormalValues } from './controls'
import { editExam, mirrorShared, type ExamContext } from './exam-consistency'

// Cambios a nivel elemento (N / A / NE, valores, hallazgos y nota). Cada uno
// devuelve un examen nuevo y consistente; los elementos compartidos se
// reflejan en su gemelo.

// Elemento en N: sin hallazgos y con los valores normales precargados.
export function makeNormal(element: ElementData, path: ElementPath) {
  element.estado = 'N'
  element.hallazgos = []
  element.valores = defaultValues(elementConfig(path)?.control)
}

function editElement(exam: PhysicalExam, path: ElementPath, ctx: ExamContext, change: (element: ElementData) => void) {
  return editExam(exam, ctx, (draft) => {
    const element = findElement(draft, path)
    if (!element) return
    change(element)
    mirrorShared(draft, path)
  })
}

export function setElementState(exam: PhysicalExam, path: ElementPath, state: ElementState, ctx: ExamContext) {
  return editElement(exam, path, ctx, (element) => {
    if (state === 'N') return makeNormal(element, path)
    element.estado = state
    if (state === 'NE') element.hallazgos = []
    // Las cuadrículas arrancan en lo normal para marcar solo lo distinto.
    if (state === 'A' && Object.keys(element.valores).length === 0) {
      element.valores = defaultValues(elementConfig(path)?.control)
    }
  })
}

// Valor de una cuadrícula / esfera / Glasgow: un valor anormal pasa a A.
export function setElementValue(exam: PhysicalExam, path: ElementPath, key: string, value: AttrValue, ctx: ExamContext) {
  return editElement(exam, path, ctx, (element) => {
    element.valores = { ...element.valores, [key]: value }
    if (hasAbnormalValues(elementConfig(path)?.control, element.valores)) element.estado = 'A'
  })
}

// Marcar un hallazgo pasa el elemento a A.
export function toggleFinding(exam: PhysicalExam, path: ElementPath, code: string, ctx: ExamContext) {
  return editElement(exam, path, ctx, (element) => {
    const exists = element.hallazgos.some((h) => h.codigo === code)
    element.hallazgos = exists
      ? element.hallazgos.filter((h) => h.codigo !== code)
      : [...element.hallazgos, { codigo: code, atributos: {} }]
    if (!exists) element.estado = 'A'
  })
}

export function setFindingAttribute(
  exam: PhysicalExam,
  path: ElementPath,
  code: string,
  key: string,
  value: AttrValue,
  ctx: ExamContext,
) {
  return editElement(exam, path, ctx, (element) => {
    const finding = element.hallazgos.find((h) => h.codigo === code)
    if (finding) finding.atributos = { ...finding.atributos, [key]: value === '' ? null : value }
  })
}

export function setElementNote(exam: PhysicalExam, path: ElementPath, note: string, ctx: ExamContext) {
  return editElement(exam, path, ctx, (element) => {
    element.nota = note.trim() === '' ? null : note
  })
}

import { PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { GuVariant, PhysicalExam, SectionData, SystemData, SystemState } from '../types'
import { sectionsOf, systemConfig } from './config-lookup'
import { emptyElement, emptySection } from './exam-init'
import { editExam, mirrorShared, type ExamContext } from './exam-consistency'
import { makeNormal } from './element-reducers'

// Cambios a nivel sistema y subapartado: Normal / Anormal / No examinado /
// Diferido (con motivo), "Todo normal", "Resto normal" y variante GU.

// Pone un bloque en un estado: Normal deja todos sus elementos en N; volver a
// "Sin documentar" los limpia.
function applySectionState(system: SystemData, section: SectionData, state: SystemState, motivo: string | null) {
  section.estado = state
  section.motivo = state === 'NO_EXAMINADO' || state === 'DIFERIDO' ? motivo : null
  if (state === 'NORMAL') {
    for (const element of section.elementos) {
      const path = { system: system.codigo, section: section === system ? undefined : section.codigo, element: element.codigo }
      makeNormal(element, path)
    }
  }
  if (state === 'SIN_DOCUMENTAR') section.elementos = section.elementos.map((e) => emptyElement(e.codigo))
}

// Refleja los elementos compartidos tras cambiar un sistema completo.
function mirrorSystem(draft: PhysicalExam, system: SystemData) {
  for (const element of system.elementos) mirrorShared(draft, { system: system.codigo, element: element.codigo })
}

export function setSystemState(
  exam: PhysicalExam,
  code: string,
  state: SystemState,
  ctx: ExamContext,
  options: { motivo?: string | null; origen?: 'manual' | 'todo_normal' } = {},
) {
  return editExam(exam, ctx, (draft) => {
    const system = draft.sistemas.find((s) => s.codigo === code)
    const config = systemConfig(code)
    if (!system || !config) return
    system.origen = options.origen ?? 'manual'
    applySectionState(system, system, state, options.motivo ?? null)
    // Normal / Sin documentar se propagan a subapartados y a la variante GU.
    if (state === 'NORMAL' || state === 'SIN_DOCUMENTAR' || config.variants) {
      for (const sub of system.subapartados) applySectionState(system, sub, state, options.motivo ?? null)
    }
    mirrorSystem(draft, system)
  })
}

// Subapartado de ORL ([N] [A] [NE]); el sistema se recalcula.
export function setSectionState(exam: PhysicalExam, code: string, sectionCode: string, state: SystemState, ctx: ExamContext) {
  return editExam(exam, ctx, (draft) => {
    const system = draft.sistemas.find((s) => s.codigo === code)
    const section = system?.subapartados.find((s) => s.codigo === sectionCode)
    if (!system || !section) return
    applySectionState(system, section, state, null)
    // El sistema resume sus subapartados: anormal si alguno lo es, normal si
    // hay alguno normal, y si no, sin documentar.
    const states = system.subapartados.map((s) => s.estado)
    system.motivo = null
    system.estado = states.includes('ANORMAL') ? 'ANORMAL' : states.includes('NORMAL') ? 'NORMAL' : 'SIN_DOCUMENTAR'
  })
}

// "Todo normal": todos los sistemas pasan a Normal y se borra lo marcado antes
// (anormales, hallazgos y motivos). Los signos vitales alterados siguen
// forzando su elemento a A.
export function setAllNormal(exam: PhysicalExam, ctx: ExamContext) {
  return exam.sistemas.reduce(
    (current, system) => setSystemState(current, system.codigo, 'NORMAL', ctx, { origen: 'todo_normal' }),
    exam,
  )
}

// En un sistema anormal, los elementos aún en NE pasan a N.
export function setRestNormal(exam: PhysicalExam, code: string, ctx: ExamContext) {
  return editExam(exam, ctx, (draft) => {
    const system = draft.sistemas.find((s) => s.codigo === code)
    const config = systemConfig(code)
    if (!system || !config) return
    for (const { data, isSubsection } of sectionsOf(config, system)) {
      for (const element of data.elementos.filter((e) => e.estado === 'NE')) {
        makeNormal(element, { system: code, section: isSubsection ? data.codigo : undefined, element: element.codigo })
      }
    }
    mirrorSystem(draft, system)
  })
}

// Cambia la variante genitourinaria (masculino / femenino) y reinicia sus elementos.
export function setVariant(exam: PhysicalExam, variant: GuVariant, ctx: ExamContext, systems = PHYSICAL_EXAM_SYSTEMS) {
  return editExam(exam, ctx, (draft) => {
    const system = draft.sistemas.find((s) => s.codigo === 'GENITOURINARIO')
    const config = systems.find((s) => s.code === 'GENITOURINARIO')
    if (!system || !config?.variants) return
    system.variante = variant
    system.subapartados = [emptySection(config.variants[variant])]
    system.estado = 'SIN_DOCUMENTAR'
    system.motivo = null
  })
}

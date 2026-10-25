import { useState } from 'react'
import type { AttrValue, ElementPath, ElementState, GuVariant, PhysicalExam, SystemState } from '../types'
import * as el from '../utils/element-reducers'
import * as sys from '../utils/system-reducers'
import { finalizeExam, type ExamContext } from '../utils/exam-consistency'
import { createExam } from '../utils/exam-init'
import { buildNarrative } from '../utils/narrative'
import { validateExam } from '../utils/validation'

// La narrativa generada siempre acompaña al estado; la final la sigue hasta
// que el médico la edita.
function withNarrative(exam: PhysicalExam): PhysicalExam {
  const generated = buildNarrative(exam).text
  if (generated === exam.narrativaGenerada && (exam.narrativaEditada || exam.narrativaFinal === generated)) return exam
  return {
    ...exam,
    narrativaGenerada: generated,
    narrativaFinal: exam.narrativaEditada ? exam.narrativaFinal : generated,
  }
}

type UsePhysicalExamOptions = {
  saved: PhysicalExam | null
  sex: 'male' | 'female' | null
  ctx: ExamContext
  // Cada cambio se entrega para guardarse (el llamador lo agrupa).
  onChange: (exam: PhysicalExam) => void
}

// Estado del formulario de examen físico y sus acciones.
export function usePhysicalExam({ saved, sex, ctx, onChange }: UsePhysicalExamOptions) {
  const [exam, setExam] = useState(() => withNarrative(finalizeExam(createExam(sex, saved), ctx)))

  const commit = (next: PhysicalExam) => {
    const complete = withNarrative(next)
    setExam(complete)
    onChange(complete)
  }

  return {
    exam,
    errors: validateExam(exam),
    setSystemState: (code: string, state: SystemState, motivo?: string | null) =>
      commit(sys.setSystemState(exam, code, state, ctx, { motivo })),
    setSectionState: (code: string, section: string, state: SystemState) =>
      commit(sys.setSectionState(exam, code, section, state, ctx)),
    setAllNormal: () => commit(sys.setAllNormal(exam, ctx)),
    setRestNormal: (code: string) => commit(sys.setRestNormal(exam, code, ctx)),
    setVariant: (variant: GuVariant) => commit(sys.setVariant(exam, variant, ctx)),
    setElementState: (path: ElementPath, state: ElementState) => commit(el.setElementState(exam, path, state, ctx)),
    setElementValue: (path: ElementPath, key: string, value: AttrValue) =>
      commit(el.setElementValue(exam, path, key, value, ctx)),
    toggleFinding: (path: ElementPath, code: string) => commit(el.toggleFinding(exam, path, code, ctx)),
    setFindingAttribute: (path: ElementPath, code: string, key: string, value: AttrValue) =>
      commit(el.setFindingAttribute(exam, path, code, key, value, ctx)),
    setElementNote: (path: ElementPath, note: string) => commit(el.setElementNote(exam, path, note, ctx)),
    // Texto editado por el médico (se guardan ambas versiones).
    setFinalNarrative: (text: string) => commit({ ...exam, narrativaFinal: text, narrativaEditada: true }),
    resetNarrative: () => commit({ ...exam, narrativaFinal: exam.narrativaGenerada, narrativaEditada: false }),
  }
}

export type PhysicalExamApi = ReturnType<typeof usePhysicalExam>

import { describe, expect, it } from 'vitest'
import { setElementNote, setElementState, setFindingAttribute, toggleFinding } from './element-reducers'
import { EMPTY_CONTEXT } from './exam-consistency'
import { createExam } from './exam-init'
import { buildNarrative } from './narrative'
import { setAllNormal, setSystemState } from './system-reducers'
import { validateExam } from './validation'

const ctx = EMPTY_CONTEXT
const lineOf = (exam: ReturnType<typeof createExam>, code: string) =>
  buildNarrative(exam).lines.find((line) => line.code === code)?.text

describe('buildNarrative', () => {
  it('examen vacío: sin narrativa (nunca precarga Normal)', () => {
    expect(buildNarrative(createExam('female')).text).toBe('')
  })

  it('todo normal: cada elemento aporta su frase normal, en orden', () => {
    const exam = setAllNormal(createExam('female'), ctx)
    const general = lineOf(exam, 'GENERAL')
    expect(general).toBe(
      'Paciente alerta, consciente, orientado, biotipo normoconstituido, bien nutrido, sin signos de dolor o dificultad aguda. Signos vitales revisados, estables y dentro de límites normales.',
    )
    expect(lineOf(exam, 'HEMATOLOGICO')).toContain(
      'No se palpan adenopatías en cadenas cervicales, supraclaviculares, axilares ni inguinales',
    )
    const text = buildNarrative(exam).text
    expect(text.indexOf('ESTADO GENERAL')).toBeLessThan(text.indexOf('CARDIOVASCULAR'))
    expect(text).toContain('Genitales externos normales, sin lesiones ni eritema')
  })

  it('un elemento en NE no aporta frase (Romberg)', () => {
    let exam = setSystemState(createExam('male'), 'NEUROLOGICO', 'NORMAL', ctx)
    exam = setElementState(exam, { system: 'NEUROLOGICO', element: 'ROMBERG' }, 'NE', ctx)
    const neuro = lineOf(exam, 'NEUROLOGICO')
    expect(neuro).not.toContain('Romberg')
    expect(neuro).toContain('Pares craneales (II al XII) evaluados y conservados')
  })

  it('un elemento anormal describe sus hallazgos, atributos y nota', () => {
    const path = { system: 'CARDIOVASCULAR', element: 'SOPLOS' }
    let exam = setSystemState(createExam('female'), 'CARDIOVASCULAR', 'NORMAL', ctx)
    exam = toggleFinding(exam, path, 'SOPLO', ctx)
    exam = setFindingAttribute(exam, path, 'SOPLO', 'tipo', 'Sistólico', ctx)
    exam = setFindingAttribute(exam, path, 'SOPLO', 'grado', 'III', ctx)
    exam = setElementNote(exam, path, 'Irradia a cuello', ctx)
    expect(exam.sistemas.find((s) => s.codigo === 'CARDIOVASCULAR')?.estado).toBe('ANORMAL')
    const cv = lineOf(exam, 'CARDIOVASCULAR')
    expect(cv).toContain('Soplos y ruidos agregados: Soplo (sistólico, III); Irradia a cuello')
    expect(cv).toContain('Ruidos cardíacos rítmicos y regulares')
  })

  it('sistema diferido: aparece con su motivo', () => {
    const exam = setSystemState(createExam('male'), 'GENITOURINARIO', 'DIFERIDO', ctx, {
      motivo: 'Se difiere/refiere a especialista',
    })
    expect(buildNarrative(exam).text).toBe('GENITOURINARIO: Diferido (Se difiere/refiere a especialista).')
  })
})

describe('reglas y validación', () => {
  it('"Todo normal" pasa todo a Normal y borra lo marcado antes', () => {
    let exam = setSystemState(createExam('female'), 'OJOS', 'NO_EXAMINADO', ctx, { motivo: 'Paciente rechaza' })
    exam = setSystemState(exam, 'PIEL', 'ANORMAL', ctx)
    exam = setAllNormal(exam, ctx)
    const ojos = exam.sistemas.find((s) => s.codigo === 'OJOS')
    expect(ojos?.estado).toBe('NORMAL')
    expect(ojos?.motivo).toBeNull()
    const piel = exam.sistemas.find((s) => s.codigo === 'PIEL')
    expect(piel?.estado).toBe('NORMAL')
    expect(piel?.elementos.every((e) => e.estado === 'N' && e.hallazgos.length === 0)).toBe(true)
    expect(exam.sistemas.every((s) => s.estado === 'NORMAL')).toBe(true)
  })

  it('signos vitales alterados fuerzan el elemento a A', () => {
    const vitalsCtx = { alteredVitals: [{ label: 'PA', value: '150/95 mmHg' }] }
    const exam = setSystemState(createExam('female'), 'GENERAL', 'NORMAL', vitalsCtx)
    expect(exam.sistemas.find((s) => s.codigo === 'GENERAL')?.estado).toBe('ANORMAL')
    expect(lineOf(exam, 'GENERAL')).toContain('Signos vitales: Signos vitales alterados (PA 150/95 mmHg)')
  })

  it('avisa obligatorios sin documentar, A sin hallazgo ni nota y lateralidad faltante', () => {
    let exam = setElementState(createExam('female'), { system: 'OJOS', element: 'PUPILAS' }, 'A', ctx)
    exam = toggleFinding(exam, { system: 'CUELLO', element: 'CAROTIDAS' }, 'SOPLO_CAROTIDEO', ctx)
    const errors = validateExam(exam)
    expect(errors.GENERAL).toEqual(['Sistema obligatorio sin documentar.'])
    expect(errors.OJOS).toContain('Pupilas: agrega un hallazgo o una nota.')
    expect(errors.CUELLO).toContain('Carótidas: indica la lateralidad de cada hallazgo.')
  })

  it('el ganglio cervical se refleja entre Cuello y Hematológico', () => {
    const exam = toggleFinding(createExam('female'), { system: 'CUELLO', element: 'GANGLIOS_CERVICALES' }, 'ADENOPATIA', ctx)
    const hemato = exam.sistemas.find((s) => s.codigo === 'HEMATOLOGICO')
    expect(hemato?.elementos.find((e) => e.codigo === 'GANGLIOS_CERVICALES')?.hallazgos).toHaveLength(1)
  })
})

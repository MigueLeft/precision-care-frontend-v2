import { PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { ElementConfig, ElementData, PhysicalExam, SectionConfig, SectionData, SystemConfig } from '../types'
import { sectionsOf } from './config-lookup'
import { describeAbnormalValues, glasgowText, joinList, orientationPhrase } from './controls'

// Narrativa del examen físico a partir del JSON (función pura). Un renglón
// por sistema, en el orden del formulario:
//  - elemento N → su frase normal; NE → nada; A → hallazgos + atributos + nota
//  - "SISTEMA: No examinado (motivo)" / "Diferido (motivo)".

export interface NarrativeLine {
  code: string
  label: string
  text: string
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

// "Sistólico" → "sistólico", pero "III" o "2+" se quedan igual.
const softLower = (value: string) => (/[a-záéíóúñ]/.test(value) ? value.toLowerCase() : value)

// Une frases: si la siguiente empieza en minúscula continúa con coma; si no,
// abre oración nueva.
export function joinPhrases(phrases: string[]): string {
  const text = phrases.reduce((acc, phrase, index) => {
    if (index === 0) return capitalize(phrase)
    const continues = phrase.charAt(0) === phrase.charAt(0).toLowerCase()
    return `${acc}${continues ? ', ' : '. '}${phrase}`
  }, '')
  return text && !text.endsWith('.') ? `${text}.` : text
}

function findingText(element: ElementConfig, data: ElementData): string[] {
  return data.hallazgos.map((finding) => {
    const config = element.findings.find((f) => f.code === finding.codigo)
    const label = config?.label ?? finding.codigo
    const attrs = [
      ...(element.paired && finding.atributos.lateralidad ? [String(finding.atributos.lateralidad).toLowerCase()] : []),
      ...(config?.attributes ?? []).flatMap((attr) => {
        const value = finding.atributos[attr.key]
        if (value == null || value === '') return []
        const shown = `${value}${attr.unit ? ` ${attr.unit}` : ''}`
        if (attr.type === 'select') return [softLower(shown)]
        return [attr.label ? `${attr.label.toLowerCase()} ${shown}` : shown]
      }),
    ]
    return attrs.length ? `${label} (${attrs.join(', ')})` : label
  })
}

function elementPhrase(element: ElementConfig, data: ElementData): string | null {
  if (data.estado === 'NE') return null
  const glasgow = element.control === 'orientation' ? glasgowText(data.valores) : null
  if (data.estado === 'N') {
    const normal = element.control === 'orientation' ? orientationPhrase(data.valores) : element.normal
    return [normal, glasgow].filter(Boolean).join('. ') || null
  }
  const parts = [
    ...(element.control === 'orientation' ? [orientationPhrase(data.valores)] : []),
    describeAbnormalValues(element.control, data.valores),
    ...findingText(element, data),
    glasgow,
    data.nota?.trim() || null,
  ].filter((part): part is string => !!part)
  return `${element.label}: ${parts.join('; ') || 'anormal'}`
}

// Cadenas ganglionares en N: una sola frase con las cadenas evaluadas.
function lymphPhrase(elements: ElementConfig[], section: SectionData): string | null {
  const normal = elements.filter(
    (e) => e.lymphChain && section.elementos.find((d) => d.codigo === e.code)?.estado === 'N',
  )
  if (normal.length === 0) return null
  return `No se palpan adenopatías en cadenas ${joinList(normal.map((e) => e.lymphChain as string), 'ni')}`
}

function sectionText(config: SectionConfig, data: SectionData): string {
  const phrases: string[] = []
  const lymph = lymphPhrase(config.elements, data)
  let lymphAdded = false
  for (const element of config.elements) {
    const elementData = data.elementos.find((e) => e.codigo === element.code)
    if (!elementData) continue
    if (element.lymphChain && elementData.estado === 'N') {
      if (lymph && !lymphAdded) phrases.push(lymph)
      lymphAdded = true
      continue
    }
    const phrase = elementPhrase(element, elementData)
    if (phrase) phrases.push(phrase)
  }
  return joinPhrases(phrases)
}

const skipped = (data: SectionData) =>
  data.estado === 'NO_EXAMINADO'
    ? `No examinado${data.motivo ? ` (${data.motivo})` : ''}`
    : `Diferido${data.motivo ? ` (${data.motivo})` : ''}`

function systemText(config: SystemConfig, exam: PhysicalExam): string | null {
  const data = exam.sistemas.find((s) => s.codigo === config.code)
  if (!data || data.estado === 'SIN_DOCUMENTAR') return null
  if (data.estado === 'NO_EXAMINADO' || data.estado === 'DIFERIDO') return `${skipped(data)}.`
  const sections = sectionsOf(config, data)
  if (!config.subsections) return sections.map((s) => sectionText(s.config, s.data)).join(' ') || null
  // ORL: cada subapartado con su nombre.
  const parts = sections.flatMap(({ config: sub, data: subData }) => {
    if (subData.estado === 'SIN_DOCUMENTAR') return []
    if (subData.estado === 'NO_EXAMINADO' || subData.estado === 'DIFERIDO') return [`${sub.label}: ${skipped(subData).toLowerCase()}.`]
    const text = sectionText(sub, subData)
    return text ? [`${sub.label}: ${text}`] : []
  })
  return parts.join(' ') || null
}

export function buildNarrative(exam: PhysicalExam, systems = PHYSICAL_EXAM_SYSTEMS) {
  const lines: NarrativeLine[] = systems.flatMap((config) => {
    const text = systemText(config, exam)
    return text ? [{ code: config.code, label: config.label, text }] : []
  })
  return {
    lines,
    text: lines.map((line) => `${line.label.toUpperCase()}: ${line.text}`).join('\n'),
  }
}

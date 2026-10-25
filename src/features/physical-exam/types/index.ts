// Examen físico de la consulta. Jerarquía: sistema → (subapartado) →
// elemento → hallazgo. El estado coincide con el JSON que guarda el backend
// en consultation.physical_exam (ver PhysicalExamSchema).

// ─── Estado (JSON guardado) ──────────────────────────────────────────────────

export type SystemState = 'SIN_DOCUMENTAR' | 'NORMAL' | 'ANORMAL' | 'NO_EXAMINADO' | 'DIFERIDO'
export type ElementState = 'N' | 'A' | 'NE'
export type AttrValue = string | number | null
export type GuVariant = 'masculino' | 'femenino'

export interface FindingData {
  codigo: string
  atributos: Record<string, AttrValue>
}

export interface ElementData {
  codigo: string
  estado: ElementState
  // Cuadrículas (pulsos, reflejos, fuerza), esferas de orientación, Glasgow…
  valores: Record<string, AttrValue>
  hallazgos: FindingData[]
  nota: string | null
}

export interface SectionData {
  codigo: string
  estado: SystemState
  motivo: string | null
  origen: 'manual' | 'todo_normal'
  elementos: ElementData[]
}

export interface SystemData extends SectionData {
  // Solo ORL (oídos, nariz, boca) y Genitourinario.
  subapartados: SectionData[]
  variante?: GuVariant | null
}

export interface PhysicalExam {
  sistemas: SystemData[]
  narrativaGenerada: string
  narrativaFinal: string
  narrativaEditada: boolean
}

// ─── Configuración (catálogos) ───────────────────────────────────────────────

export type AttributeType = 'laterality' | 'select' | 'text' | 'number'

export interface AttributeConfig {
  key: string
  label: string
  type: AttributeType
  options?: string[]
  unit?: string
  // La lateralidad de estructuras pares es obligatoria.
  required?: boolean
}

export interface FindingConfig {
  code: string
  label: string
  attributes?: AttributeConfig[]
}

// Controles especiales de algunos elementos.
export type ElementControl = 'pulses' | 'reflexes' | 'strength' | 'orientation'

export interface ElementConfig {
  code: string
  label: string
  // Frase de la narrativa cuando el elemento está en N.
  normal: string
  // Estructura par: cada hallazgo exige lateralidad.
  paired?: boolean
  findings: FindingConfig[]
  control?: ElementControl
  // Mismo dato en otro sistema (se refleja en ambos, sin capturarlo dos veces).
  sharedWith?: { system: string; element: string }
  // Cadenas ganglionares: se narran juntas en una sola frase.
  lymphChain?: string
}

export interface SectionConfig {
  code: string
  label: string
  elements: ElementConfig[]
}

export interface SystemConfig extends SectionConfig {
  subsections?: SectionConfig[]
  // Genitourinario: elementos según el sexo.
  variants?: Record<GuVariant, SectionConfig>
  // Muestra "Diferido" destacado (Genitourinario).
  highlightDeferred?: boolean
}

// Signo vital fuera de rango (de la antropometría de la consulta).
export interface AlteredVital {
  label: string
  value: string
}

// Ruta a un elemento: sistema, subapartado (ORL/GU) y elemento.
export interface ElementPath {
  system: string
  section?: string
  element: string
}

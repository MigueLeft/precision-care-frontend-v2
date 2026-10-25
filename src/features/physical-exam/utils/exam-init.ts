import { PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { ElementData, GuVariant, PhysicalExam, SectionConfig, SectionData, SystemConfig, SystemData } from '../types'

// Creación del examen vacío (todo "Sin documentar", nunca precarga Normal) y
// combinación con un examen guardado: si el catálogo cambia, lo guardado se
// conserva y lo nuevo aparece sin documentar.

export const emptyElement = (codigo: string): ElementData => ({
  codigo,
  estado: 'NE',
  valores: {},
  hallazgos: [],
  nota: null,
})

export function emptySection(config: SectionConfig, saved?: SectionData): SectionData {
  return {
    codigo: config.code,
    estado: saved?.estado ?? 'SIN_DOCUMENTAR',
    motivo: saved?.motivo ?? null,
    origen: saved?.origen ?? 'manual',
    elementos: config.elements.map(
      (element) => saved?.elementos.find((e) => e.codigo === element.code) ?? emptyElement(element.code),
    ),
  }
}

function emptySystem(config: SystemConfig, variant: GuVariant, saved?: SystemData): SystemData {
  const base = emptySection(config, saved)
  if (config.subsections) {
    return {
      ...base,
      subapartados: config.subsections.map((sub) =>
        emptySection(sub, saved?.subapartados.find((s) => s.codigo === sub.code)),
      ),
    }
  }
  if (config.variants) {
    const chosen = saved?.variante ?? variant
    const section = config.variants[chosen]
    return {
      ...base,
      variante: chosen,
      subapartados: [emptySection(section, saved?.subapartados.find((s) => s.codigo === section.code))],
    }
  }
  return { ...base, subapartados: [] }
}

// Variante genitourinaria según el sexo del paciente (cambiable a mano).
export function variantForSex(sex: 'male' | 'female' | null | undefined): GuVariant {
  return sex === 'male' ? 'masculino' : 'femenino'
}

export function createExam(
  sex?: 'male' | 'female' | null,
  saved?: PhysicalExam | null,
  systems = PHYSICAL_EXAM_SYSTEMS,
): PhysicalExam {
  const variant = variantForSex(sex)
  return {
    sistemas: systems.map((config) =>
      emptySystem(config, variant, saved?.sistemas.find((s) => s.codigo === config.code)),
    ),
    narrativaGenerada: saved?.narrativaGenerada ?? '',
    narrativaFinal: saved?.narrativaFinal ?? '',
    narrativaEditada: saved?.narrativaEditada ?? false,
  }
}

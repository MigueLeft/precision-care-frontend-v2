import { PHYSICAL_EXAM_SYSTEMS } from '../config'
import type { ElementConfig, ElementData, ElementPath, PhysicalExam, SectionConfig, SectionData, SystemConfig, SystemData } from '../types'

// Búsquedas entre la configuración y el estado del examen.

export function systemConfig(code: string, systems = PHYSICAL_EXAM_SYSTEMS): SystemConfig | undefined {
  return systems.find((system) => system.code === code)
}

export interface SectionPair {
  config: SectionConfig
  data: SectionData
  // false = el sistema mismo (sin subapartados).
  isSubsection: boolean
}

// Bloques de elementos de un sistema: el sistema mismo, sus subapartados (ORL)
// o la variante elegida (Genitourinario).
export function sectionsOf(config: SystemConfig, data: SystemData): SectionPair[] {
  if (config.subsections) {
    return config.subsections.flatMap((sub) => {
      const subData = data.subapartados.find((s) => s.codigo === sub.code)
      return subData ? [{ config: sub, data: subData, isSubsection: true }] : []
    })
  }
  if (config.variants) {
    const variant = config.variants[data.variante ?? 'femenino']
    const subData = data.subapartados.find((s) => s.codigo === variant.code)
    return subData ? [{ config: variant, data: subData, isSubsection: true }] : []
  }
  return [{ config, data, isSubsection: false }]
}

export function findSystem(exam: PhysicalExam, code: string): SystemData | undefined {
  return exam.sistemas.find((system) => system.codigo === code)
}

// Bloque donde vive un elemento (sistema o subapartado).
export function findSection(exam: PhysicalExam, path: ElementPath): SectionData | undefined {
  const system = findSystem(exam, path.system)
  if (!system) return undefined
  return path.section ? system.subapartados.find((s) => s.codigo === path.section) : system
}

export function findElement(exam: PhysicalExam, path: ElementPath): ElementData | undefined {
  return findSection(exam, path)?.elementos.find((e) => e.codigo === path.element)
}

export function elementConfig(path: ElementPath, systems = PHYSICAL_EXAM_SYSTEMS): ElementConfig | undefined {
  const config = systemConfig(path.system, systems)
  if (!config) return undefined
  const sections: SectionConfig[] = [config, ...(config.subsections ?? []), ...Object.values(config.variants ?? {})]
  const section = path.section ? sections.find((s) => s.code === path.section) : config
  return section?.elements.find((e) => e.code === path.element)
}

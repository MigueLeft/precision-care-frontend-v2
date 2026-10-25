import type { SystemConfig } from '../types'
import { MUSCULOESQUELETICO, PIEL, HEMATOLOGICO } from './systems-body'
import { CUELLO, GENERAL, OJOS, ORL } from './systems-head'
import { MENTAL, NEUROLOGICO } from './systems-neuro'
import { ABDOMEN, CARDIOVASCULAR, GENITOURINARIO, RESPIRATORIO } from './systems-trunk'

// Los 13 apartados del examen físico, en el orden del formulario y de la
// narrativa.
export const PHYSICAL_EXAM_SYSTEMS: SystemConfig[] = [
  GENERAL,
  OJOS,
  ORL,
  CUELLO,
  CARDIOVASCULAR,
  RESPIRATORIO,
  ABDOMEN,
  GENITOURINARIO,
  MUSCULOESQUELETICO,
  PIEL,
  HEMATOLOGICO,
  NEUROLOGICO,
  MENTAL,
]

export * from './scales'

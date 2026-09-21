import {
  isGroupApplicable,
  type IntakePatientSex,
  type IntakeResponseDetailGroup,
} from '@/features/intake-responses'

export interface IntakeStep {
  title: string
  groups: IntakeResponseDetailGroup[]
}

const DEFAULT_STEP_TITLE = 'Formulario'

// Agrupa las secciones en pasos (A, B, C…) según `stepTitle`. Las secciones
// restringidas a un sexo distinto a `sex` se omiten (o todas las restringidas
// si aún no se conoce), y un paso sin secciones visibles no se genera.
export function buildIntakeSteps(
  groups: IntakeResponseDetailGroup[],
  sex: IntakePatientSex | null,
): IntakeStep[] {
  const steps: IntakeStep[] = []
  for (const group of groups) {
    if (!isGroupApplicable(group, sex)) continue

    const title = group.stepTitle ?? DEFAULT_STEP_TITLE
    const last = steps[steps.length - 1]
    if (last && last.title === title) last.groups.push(group)
    else steps.push({ title, groups: [group] })
  }
  return steps
}

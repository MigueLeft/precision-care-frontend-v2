import type {
  IntakePatientSex,
  IntakeResponseDetailGroup,
  IntakeResponseDetailQuestion,
} from '../types'

// La pregunta "Sexo" se reconoce por los `value` de sus opciones ('female' y
// 'male', los mismos que patient.sex), no por su texto.
export function findSexQuestion(
  groups: IntakeResponseDetailGroup[],
): IntakeResponseDetailQuestion | undefined {
  return groups
    .flatMap((group) => group.questions)
    .find((question) => {
      const values = question.options?.map((option) => option.value) ?? []
      return values.includes('female') && values.includes('male')
    })
}

export function sexFromOptionId(
  question: IntakeResponseDetailQuestion,
  optionId: number | undefined,
): IntakePatientSex | null {
  const value = question.options?.find((option) => option.id === optionId)?.value
  return value === 'female' || value === 'male' ? value : null
}

// Sexo con el que se decide qué secciones aplican: la respuesta a "Sexo" si
// existe; si no, el del paciente.
export function resolveEffectiveSex(
  answeredSex: IntakePatientSex | null,
  patientSex: IntakePatientSex | null,
): IntakePatientSex | null {
  return answeredSex ?? patientSex
}

// Sexo según la respuesta ya guardada de un ingresable.
export function getSavedAnswerSex(
  groups: IntakeResponseDetailGroup[],
): IntakePatientSex | null {
  const question = findSexQuestion(groups)
  return question ? sexFromOptionId(question, question.answer?.selectedOptionIds[0]) : null
}

// Una sección con `sexRestriction` solo aplica a ese sexo.
export function isGroupApplicable(
  group: IntakeResponseDetailGroup,
  sex: IntakePatientSex | null,
): boolean {
  return !group.sexRestriction || group.sexRestriction === sex
}

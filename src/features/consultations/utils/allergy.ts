import type { ConsultationAllergy } from '../types'

// Alergia severa: se resalta y se muestra en la barra del paciente.
export const isSevereAllergy = (allergy: ConsultationAllergy) =>
  /sever[oa]|grave/i.test(allergy.severityName ?? '')

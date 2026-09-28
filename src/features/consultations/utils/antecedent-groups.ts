import type { Antecedent } from '@/features/antecedents'

// Agrupa las categorías de antecedentes que se capturan en la consulta:
// familiares, personales y quirúrgicos/hospitalizaciones.
export function groupAntecedents(antecedents: Antecedent[]) {
  return {
    family: antecedents.filter((a) => a.type === 'family'),
    personal: antecedents.filter((a) => a.type === 'personal' || a.type === 'other'),
    surgical: antecedents.filter((a) => a.type === 'surgery' || a.type === 'hospitalization'),
  }
}

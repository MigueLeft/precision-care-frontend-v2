import type { LifestyleAssessment, LifestyleComponentType } from '../types'

// Contenido ficticio: aún no existe un flujo de captura real (cuestionario →
// lifestyle_assessment) en el frontend, así que este panel muestra sólo el
// diseño con datos de ejemplo hasta que se construya esa captura.
function component(component: LifestyleComponentType, score: number, note: string) {
  return { component, score: String(score), rawValue: { note } }
}

export function buildMockLifestyleAssessment(patientId: number): LifestyleAssessment {
  return {
    id: 0,
    patientId,
    assessmentDate: '2026-05-23T12:00:00.000Z',
    globalScore: '54',
    questionnaireResponseId: null,
    components: [
      component('diet', 42, 'Alta en carbohidratos refinados. Sin adherencia a plan nutricional.'),
      component('physical_activity', 35, 'Sedentaria. Camina <30 min/semana.'),
      component('nicotine', 100, 'No fumadora, nunca fumó.'),
      component('sleep', 58, '5–6 h/noche. Dificultad para conciliar sueño.'),
      component('bmi', 60, 'IMC 27.1 — sobrepeso.'),
      component('lipids', 48, 'LDL 122, triglicéridos 187 mg/dL.'),
      component('glucose', 30, 'HbA1c 7.8%, glucosa ayuno 134 mg/dL.'),
      component('blood_pressure', 62, '128/82 mmHg.'),
    ],
    createdAt: '2026-05-23T12:00:00.000Z',
    updatedAt: '2026-05-23T12:00:00.000Z',
  }
}

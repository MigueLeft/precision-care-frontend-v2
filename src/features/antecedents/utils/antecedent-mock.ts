import type { Antecedent } from '../types'

// Contenido ficticio: aún no existe captura real de antecedentes para el
// paciente que se está viendo, así que se muestra el diseño con datos de
// ejemplo (misma lógica que lifestyle-mock.ts). IDs negativos marcan estas
// filas como "de ejemplo" para bloquear editar/eliminar sobre ellas.
export function isMockAntecedent(antecedent: Antecedent): boolean {
  return antecedent.id < 0
}

function mock(overrides: Partial<Antecedent> & { id: number; type: Antecedent['type']; name: string }): Antecedent {
  return {
    patientId: 0,
    cie10Code: null,
    description: null,
    eventDate: null,
    relationship: null,
    status: null,
    familyCatalogId: null,
    personalCatalogId: null,
    surgeryDetail: null,
    hospitalizationDetail: null,
    createdAt: '2026-05-23T12:00:00.000Z',
    updatedAt: '2026-05-23T12:00:00.000Z',
    ...overrides,
  }
}

export const MOCK_FAMILY_ANTECEDENTS: Antecedent[] = [
  mock({
    id: -1,
    type: 'family',
    relationship: 'Madre',
    name: 'Diabetes tipo 2',
    description: 'Diagnosticada a los 52 años, en tratamiento con metformina.',
  }),
  mock({
    id: -2,
    type: 'family',
    relationship: 'Padre',
    name: 'Hipertensión arterial',
    description: 'Controlada con enalapril.',
  }),
  mock({
    id: -3,
    type: 'family',
    relationship: 'Abuela materna',
    name: 'Cáncer de mama',
    cie10Code: 'C50',
    description: 'Diagnóstico a los 60 años, mastectomía.',
  }),
]

export const MOCK_PERSONAL_ANTECEDENTS: Antecedent[] = [
  mock({
    id: -4,
    type: 'personal',
    name: 'Asma bronquial',
    eventDate: '2005-03-10',
    status: 'in_follow_up',
    description: 'Crisis ocasionales, uso de salbutamol de rescate.',
  }),
  mock({
    id: -5,
    type: 'personal',
    name: 'Gastritis crónica',
    eventDate: '2018-06-01',
    status: 'active',
    description: 'Tratamiento intermitente con omeprazol.',
  }),
  mock({
    id: -6,
    type: 'personal',
    name: 'Migraña',
    eventDate: '2015-01-01',
    status: 'in_follow_up',
    description: 'Episodios mensuales, sin aura.',
  }),
]

export const MOCK_SURGICAL_ANTECEDENTS: Antecedent[] = [
  mock({
    id: -7,
    type: 'surgery',
    name: 'Apendicectomía laparoscópica',
    eventDate: '2012-08-14',
    cie10Code: 'K35.80',
    surgeryDetail: {
      antecedentId: -7,
      procedure: 'Apendicectomía laparoscópica',
      institution: 'Hospital General',
      complications: 'Ninguna',
      treatingPhysician: 'Dr. Ramírez',
      procedureCatalogId: null,
    },
  }),
  mock({
    id: -8,
    type: 'hospitalization',
    name: 'Neumonía adquirida en la comunidad',
    hospitalizationDetail: {
      antecedentId: -8,
      admissionDate: '2019-11-02',
      dischargeDate: '2019-11-09',
      reason: 'Neumonía adquirida en la comunidad',
      institution: 'Hospital Ángeles',
      dischargeDiagnosisCie10: 'J18.9',
      reasonCatalogId: null,
    },
  }),
]

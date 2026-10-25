import type { AttributeConfig, FindingConfig } from '../types'

// Escalas, cuadrículas, motivos y reglas del examen físico. Editables sin
// tocar la interfaz.

export const SCALES = {
  pulse: ['0', '1+', '2+', '3+', '4+'],
  murmur: ['I', 'II', 'III', 'IV', 'V', 'VI'],
  edema: ['1+', '2+', '3+', '4+'],
  strength: ['0', '1', '2', '3', '4', '5'],
  reflex: ['0', '1+', '2+', '3+', '4+'],
  tonsils: ['1', '2', '3', '4'],
  glasgowEye: ['1', '2', '3', '4'],
  glasgowVerbal: ['1', '2', '3', '4', '5'],
  glasgowMotor: ['1', '2', '3', '4', '5', '6'],
}

export const LATERALITY = ['Derecho', 'Izquierdo', 'Bilateral']
export const SIDES = ['Derecho', 'Izquierdo']

// Cuadrículas: filas × lados, con el valor normal precargado en N.
export const PULSE_GRID = {
  rows: [
    { key: 'radial', label: 'Radial' },
    { key: 'pedio', label: 'Pedio' },
    { key: 'tibial_posterior', label: 'Tibial posterior' },
  ],
  scale: SCALES.pulse,
  normal: '2+',
  noun: 'Pulso',
}

export const REFLEX_GRID = {
  rows: [
    { key: 'bicipital', label: 'Bicipital' },
    { key: 'tricipital', label: 'Tricipital' },
    { key: 'rotuliano', label: 'Rotuliano' },
    { key: 'aquileo', label: 'Aquíleo' },
  ],
  scale: SCALES.reflex,
  normal: '2+',
  noun: 'Reflejo',
}

export const STRENGTH_GRID = {
  rows: [
    { key: 'superior', label: 'Miembro superior' },
    { key: 'inferior', label: 'Miembro inferior' },
  ],
  scale: SCALES.strength,
  normal: '5',
  noun: 'Fuerza',
}

export const GRID_SIDES = [
  { key: 'der', label: 'derecho' },
  { key: 'izq', label: 'izquierdo' },
]

export const ORIENTATION_SPHERES = [
  { key: 'tiempo', label: 'tiempo' },
  { key: 'espacio', label: 'espacio' },
  { key: 'persona', label: 'persona' },
  { key: 'situacion', label: 'situación' },
]

// Motivos de "No examinado" / "Diferido" ("Otro" exige texto).
export const SKIP_REASONS = [
  'No pertinente al motivo de consulta',
  'Paciente rechaza',
  'Sin chaperón disponible',
  'Se difiere/refiere a especialista',
  'Otro',
]
export const OTHER_REASON = 'Otro'

// Sistemas que no pueden quedar "Sin documentar" (se avisa).
export const MANDATORY_SYSTEMS = ['GENERAL', 'CARDIOVASCULAR', 'RESPIRATORIO', 'ABDOMEN']

// Umbrales de signos vitales (mismos que el reporte de antropometría).
export const VITAL_THRESHOLDS = {
  systolicMax: 120,
  diastolicMax: 80,
  heartRateMin: 60,
  heartRateMax: 100,
  oxygenSaturationMin: 95,
}

// ─── Constructores para los catálogos ────────────────────────────────────────

export const side = (label = 'Lado'): AttributeConfig => ({ key: 'lado', label, type: 'select', options: SIDES })
export const select = (key: string, label: string, options: string[]): AttributeConfig => ({ key, label, type: 'select', options })
export const number = (key: string, label: string, unit?: string): AttributeConfig => ({ key, label, type: 'number', unit })
export const text = (key: string, label: string): AttributeConfig => ({ key, label, type: 'text' })
export const finding = (code: string, label: string, attributes?: AttributeConfig[]): FindingConfig => ({
  code,
  label,
  attributes,
})

// Adenopatía: el mismo hallazgo en cuello y en hematológico/linfático.
export const ADENOPATHY_ATTRIBUTES = [
  number('tamano', 'Tamaño', 'cm'),
  select('consistencia', 'Consistencia', ['Blanda', 'Elástica', 'Dura', 'Pétrea']),
  select('dolor', 'Dolor', ['Dolorosa', 'No dolorosa']),
  select('movilidad', 'Movilidad', ['Móvil', 'Fija']),
]

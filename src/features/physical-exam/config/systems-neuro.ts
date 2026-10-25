import type { SystemConfig } from '../types'
import { finding as f, select, side, text } from './scales'

// Sistemas 12–13: neurológico y estado mental / psiquiátrico.

export const NEUROLOGICO: SystemConfig = {
  code: 'NEUROLOGICO',
  label: 'Neurológico',
  elements: [
    {
      code: 'ORIENTACION',
      label: 'Orientación',
      normal: 'Paciente alerta y orientado en tiempo, espacio, persona y situación',
      control: 'orientation',
      findings: [],
    },
    {
      code: 'PARES',
      label: 'Pares craneales',
      normal: 'Pares craneales (II al XII) evaluados y conservados',
      findings: [f('PARESIA_PAR', 'Paresia de par craneal', [select('par', 'Par', ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']), side()])],
    },
    {
      code: 'FUERZA',
      label: 'Fuerza',
      normal: 'Fuerza motora 5/5 simétrica',
      control: 'strength',
      sharedWith: { system: 'MUSCULOESQUELETICO', element: 'FUERZA' },
      findings: [],
    },
    { code: 'SENSIBILIDAD', label: 'Sensibilidad', normal: 'Sensibilidad táctil conservada bilateralmente', findings: [f('HIPOESTESIA', 'Hipoestesia', [text('territorio', 'Territorio')])] },
    {
      code: 'REFLEJOS',
      label: 'Reflejos osteotendinosos',
      normal: 'Reflejos osteotendinosos normorreflectivos (2+/4) y simétricos',
      control: 'reflexes',
      findings: [f('BABINSKI', 'Babinski +', [side()])],
    },
    { code: 'COORDINACION', label: 'Coordinación', normal: 'Coordinación (prueba dedo-nariz) normal', findings: [f('DISMETRIA', 'Dismetría', [side()]), f('MARCHA_ATAXICA', 'Marcha atáxica')] },
    { code: 'ROMBERG', label: 'Romberg', normal: 'Prueba de Romberg negativa', findings: [f('ROMBERG_POSITIVO', 'Romberg positivo')] },
    { code: 'MENINGEOS', label: 'Signos meníngeos', normal: 'Sin signos meníngeos', findings: [f('MENINGEOS_POSITIVOS', 'Signos meníngeos +')] },
  ],
}

export const MENTAL: SystemConfig = {
  code: 'MENTAL',
  label: 'Estado mental / Psiquiátrico',
  elements: [
    { code: 'CONDUCTA', label: 'Conducta y contacto', normal: 'Colaborador, con adecuado contacto visual', findings: [f('AGITADO', 'Inquieto/agitado'), f('POBRE_CONTACTO', 'Pobre contacto visual')] },
    {
      code: 'AFECTO',
      label: 'Afecto/ánimo',
      normal: 'Afecto y estado de ánimo eutímico y congruente',
      findings: [f('DEPRIMIDO', 'Ánimo deprimido'), f('ANSIOSO', 'Ánimo ansioso'), f('EUFORICO', 'Ánimo eufórico'), f('APLANADO', 'Afecto aplanado'), f('INCONGRUENTE', 'Afecto incongruente')],
    },
    {
      code: 'LENGUAJE',
      label: 'Lenguaje',
      normal: 'Lenguaje claro, fluido y coherente, con velocidad y volumen normales',
      findings: [f('TAQUILALICO', 'Lenguaje taquilálico'), f('DISARTRICO', 'Lenguaje disártrico')],
    },
    {
      code: 'PENSAMIENTO',
      label: 'Pensamiento',
      normal: 'Pensamiento lógico, lineal y dirigido a metas',
      findings: [f('PENSAMIENTO_ALTERADO', 'Pensamiento alterado', [select('tipo', 'Tipo', ['Tangencial', 'Circunstancial', 'Disgregado'])])],
    },
    {
      code: 'SENSOPERCEPCION',
      label: 'Sensopercepción',
      normal: 'Sin alteraciones sensoperceptivas ni ideación delirante',
      findings: [f('DELIRANTES', 'Ideas delirantes', [text('tipo', 'Tipo')]), f('ALUCINACIONES', 'Alucinaciones', [select('modalidad', 'Modalidad', ['Auditivas', 'Visuales', 'Táctiles', 'Olfativas'])])],
    },
    {
      code: 'RIESGO',
      label: 'Riesgo (ideación suicida/homicida)',
      normal: 'Niega ideación suicida u homicida',
      findings: [f('IDEACION_SUICIDA', 'Ideación suicida', [select('plan', 'Plan', ['Con plan', 'Sin plan'])])],
    },
  ],
}


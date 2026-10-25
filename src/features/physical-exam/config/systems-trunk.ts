import type { SystemConfig } from '../types'
import { finding as f, number, SCALES, select, text } from './scales'

// Sistemas 5–8: cardiovascular, respiratorio, abdomen y genitourinario.

const LUNG_FIELD = select('campo', 'Campo', ['Superior', 'Medio', 'Inferior', 'Basal', 'Difuso'])
const ABDOMEN_REGION = select('region', 'Región', [
  'Epigastrio', 'Hipocondrio derecho', 'Hipocondrio izquierdo', 'Mesogastrio', 'Flanco derecho',
  'Flanco izquierdo', 'Fosa ilíaca derecha', 'Fosa ilíaca izquierda', 'Hipogastrio', 'Difuso',
])

export const CARDIOVASCULAR: SystemConfig = {
  code: 'CARDIOVASCULAR',
  label: 'Cardiovascular',
  elements: [
    { code: 'RITMO', label: 'Ritmo y ruidos', normal: 'Ruidos cardíacos rítmicos y regulares, con R1 y R2 de adecuada intensidad', findings: [f('RITMO_IRREGULAR', 'Ritmo irregular')] },
    {
      code: 'SOPLOS',
      label: 'Soplos y ruidos agregados',
      normal: 'Sin soplos, galopes, clics ni frotes pericárdicos',
      findings: [
        f('SOPLO', 'Soplo', [
          select('tipo', 'Tipo', ['Sistólico', 'Diastólico']),
          select('grado', 'Grado', SCALES.murmur),
          select('foco', 'Foco', ['Aórtico', 'Pulmonar', 'Tricuspídeo', 'Mitral']),
          text('irradiacion', 'Irradiación'),
        ]),
        f('GALOPE_S3', 'Galope S3'), f('GALOPE_S4', 'Galope S4'), f('FROTE', 'Frote pericárdico'), f('CLIC', 'Clic'),
      ],
    },
    {
      code: 'PULSOS',
      label: 'Pulsos periféricos',
      normal: 'Pulsos periféricos (radiales, pedios y tibiales posteriores) presentes, simétricos y de buena amplitud (2+/4)',
      control: 'pulses',
      findings: [],
    },
    { code: 'LLENADO_CAPILAR', label: 'Llenado capilar', normal: 'Llenado capilar < 2 segundos', findings: [f('LLENADO_LENTO', 'Llenado capilar > 2 s')] },
    {
      code: 'EDEMA',
      label: 'Edema',
      normal: 'Sin edemas periféricos',
      findings: [
        f('EDEMA', 'Edema', [
          text('localizacion', 'Localización'),
          select('lado', 'Lado', ['Derecho', 'Izquierdo', 'Bilateral']),
          select('grado', 'Grado', SCALES.edema),
          select('fovea', 'Fóvea', ['Con fóvea', 'Sin fóvea']),
        ]),
      ],
    },
  ],
}

export const RESPIRATORIO: SystemConfig = {
  code: 'RESPIRATORIO',
  label: 'Respiratorio',
  elements: [
    {
      code: 'MURMULLO',
      label: 'Murmullo vesicular',
      normal: 'Murmullo vesicular conservado y simétrico en ambos campos pulmonares',
      paired: true,
      findings: [f('MV_DISMINUIDO', 'Murmullo disminuido/abolido', [LUNG_FIELD]), f('MATIDEZ', 'Matidez a la percusión', [LUNG_FIELD])],
    },
    {
      code: 'RUIDOS_AGREGADOS',
      label: 'Ruidos agregados',
      normal: 'sin ruidos sobreagregados (sin estertores, sibilancias ni roncus)',
      findings: [
        f('CREPITANTES', 'Crepitantes', [select('tipo', 'Tipo', ['Finos', 'Gruesos']), text('localizacion', 'Localización')]),
        f('SIBILANCIAS', 'Sibilancias', [select('fase', 'Fase', ['Inspiratorias', 'Espiratorias']), select('extension', 'Extensión', ['Difusas', 'Localizadas'])]),
        f('RONCUS', 'Roncus'),
        f('FROTE_PLEURAL', 'Frote pleural'),
      ],
    },
    {
      code: 'MECANICA',
      label: 'Mecánica ventilatoria',
      normal: 'Mecánica ventilatoria normal, sin uso de musculatura accesoria',
      findings: [
        f('TIRAJE', 'Tiraje', [select('tipo', 'Tipo', ['Intercostal', 'Subcostal', 'Supraclavicular'])]),
        f('ACCESORIA', 'Uso de musculatura accesoria'),
        f('TAQUIPNEA', 'Taquipnea'),
      ],
    },
  ],
}

export const ABDOMEN: SystemConfig = {
  code: 'ABDOMEN',
  label: 'Gastrointestinal / Abdomen',
  elements: [
    { code: 'INSPECCION', label: 'Inspección', normal: 'Abdomen no distendido', findings: [f('DISTENDIDO', 'Distendido'), f('ASCITIS', 'Ascitis')] },
    {
      code: 'RHA',
      label: 'Ruidos hidroaéreos',
      normal: 'Ruidos hidroaéreos presentes y normoactivos en los cuatro cuadrantes',
      findings: [f('RHA_AUMENTADOS', 'RHA aumentados'), f('RHA_DISMINUIDOS', 'RHA disminuidos'), f('RHA_AUSENTES', 'RHA ausentes')],
    },
    {
      code: 'PALPACION',
      label: 'Palpación/dolor',
      normal: 'blando, depresible, no doloroso a la palpación superficial ni profunda',
      findings: [f('DOLOR', 'Dolor a la palpación', [ABDOMEN_REGION]), f('MURPHY', 'Murphy +'), f('MCBURNEY', 'McBurney +')],
    },
    {
      code: 'PERITONEAL',
      label: 'Irritación peritoneal',
      normal: 'Sin signos de irritación peritoneal (sin defensa, rigidez ni dolor de rebote)',
      findings: [f('DEFENSA', 'Defensa'), f('RIGIDEZ', 'Rigidez'), f('REBOTE', 'Rebote (Blumberg)')],
    },
    {
      code: 'VISCEROMEGALIAS',
      label: 'Visceromegalias y masas',
      normal: 'Sin visceromegalias (sin hepatomegalia ni esplenomegalia) ni masas palpables',
      findings: [
        f('HEPATOMEGALIA', 'Hepatomegalia', [number('cm', 'Bajo reborde', 'cm')]),
        f('ESPLENOMEGALIA', 'Esplenomegalia'),
        f('MASA', 'Masa', [ABDOMEN_REGION, number('tamano', 'Tamaño', 'cm')]),
      ],
    },
    { code: 'HERNIAS', label: 'Hernias', normal: 'Sin hernias', findings: [f('HERNIA', 'Hernia', [select('tipo', 'Tipo', ['Umbilical', 'Inguinal', 'Incisional', 'Epigástrica'])])] },
  ],
}

export const GENITOURINARIO: SystemConfig = {
  code: 'GENITOURINARIO',
  label: 'Genitourinario',
  highlightDeferred: true,
  elements: [],
  variants: {
    masculino: {
      code: 'MASCULINO',
      label: 'Masculino',
      elements: [
        { code: 'GENITALES_M', label: 'Genitales externos', normal: 'Genitales externos masculinos normales', findings: [f('LESION_M', 'Lesión', [select('tipo', 'Tipo', ['Úlcera', 'Verruga'])])] },
        {
          code: 'TESTICULOS',
          label: 'Testículos',
          normal: 'Testículos descendidos bilateralmente, sin masas ni dolor',
          paired: true,
          findings: [f('NO_DESCENDIDO', 'Testículo no descendido'), f('MASA_TESTICULAR', 'Masa testicular'), f('DOLOR_TESTICULAR', 'Dolor testicular'), f('VARICOCELE', 'Varicocele'), f('HIDROCELE', 'Hidrocele')],
        },
        { code: 'URETRA', label: 'Uretra', normal: 'Sin secreciones uretrales ni lesiones', findings: [f('SECRECION_URETRAL', 'Secreción uretral')] },
        { code: 'INGUINAL', label: 'Región inguinal', normal: 'Sin hernias inguinales', paired: true, findings: [f('HERNIA_INGUINAL', 'Hernia inguinal')] },
      ],
    },
    femenino: {
      code: 'FEMENINO',
      label: 'Femenino',
      elements: [
        { code: 'GENITALES_F', label: 'Genitales externos', normal: 'Genitales externos normales, sin lesiones ni eritema', findings: [f('ERITEMA_VULVAR', 'Eritema vulvar'), f('LESION_F', 'Lesión', [select('tipo', 'Tipo', ['Úlcera', 'Verruga', 'Masa'])])] },
        { code: 'SECRECION_F', label: 'Secreción', normal: 'sin secreciones anormales', findings: [f('SECRECION_ANORMAL', 'Secreción anormal', [text('caracteristicas', 'Características')])] },
      ],
    },
  },
}


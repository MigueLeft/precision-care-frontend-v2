import type { SystemConfig } from '../types'
import { ADENOPATHY_ATTRIBUTES, finding as f, number, SCALES, select, side, text } from './scales'

// Sistemas 1–4: estado general, ojos, ORL y cuello.

export const GENERAL: SystemConfig = {
  code: 'GENERAL',
  label: 'Estado general',
  elements: [
    { code: 'CONCIENCIA', label: 'Nivel de conciencia', normal: 'Paciente alerta, consciente', findings: [f('SOMNOLIENTO', 'Somnoliento'), f('ESTUPOROSO', 'Estuporoso')] },
    { code: 'ORIENTACION', label: 'Orientación', normal: 'orientado', findings: [f('DESORIENTADO', 'Desorientado')] },
    { code: 'NUTRICION', label: 'Estado nutricional', normal: 'biotipo normoconstituido, bien nutrido', findings: [f('CAQUECTICO', 'Caquéctico'), f('SOBREPESO', 'Sobrepeso/Obeso')] },
    {
      code: 'GRAVEDAD',
      label: 'Aspecto de gravedad',
      normal: 'sin signos de dolor o dificultad aguda',
      findings: [f('DIAFORETICO', 'Diaforético'), f('FACIES_DOLOR', 'Facies de dolor'), f('TOXICO', 'Aspecto tóxico/grave')],
    },
    {
      code: 'SIGNOS_VITALES',
      label: 'Signos vitales',
      normal: 'Signos vitales revisados, estables y dentro de límites normales',
      findings: [f('SV_ALTERADOS', 'Signos vitales alterados', [text('valores', '')])],
    },
  ],
}

export const OJOS: SystemConfig = {
  code: 'OJOS',
  label: 'Ojos',
  elements: [
    {
      code: 'PUPILAS',
      label: 'Pupilas',
      normal: 'Pupilas isocóricas, redondas, reactivas a la luz y a la acomodación',
      paired: true,
      findings: [f('ANISOCORIA', 'Anisocoria', [number('mm_der', 'Der', 'mm'), number('mm_izq', 'Izq', 'mm')]), f('NO_REACTIVA', 'Pupila no reactiva')],
    },
    {
      code: 'MEO',
      label: 'Movimientos extraoculares',
      normal: 'Movimientos extraoculares conservados sin nistagmo',
      findings: [f('NISTAGMO', 'Nistagmo', [select('direccion', 'Dirección', ['Horizontal', 'Vertical', 'Rotatorio'])]), f('ESTRABISMO', 'Estrabismo/paresia de mirada')],
    },
    {
      code: 'CONJUNTIVAS',
      label: 'Conjuntivas',
      normal: 'Conjuntivas normocoloreadas, sin secreciones, inyección conjuntival ni lesiones',
      paired: true,
      findings: [
        f('PALIDA', 'Conjuntiva pálida'),
        f('INYECCION', 'Inyección conjuntival'),
        f('SECRECION', 'Secreción', [select('tipo', 'Tipo', ['Purulenta', 'Serosa'])]),
        f('HEMORRAGIA', 'Hemorragia subconjuntival'),
        f('LESION_PALPEBRAL', 'Lesión palpebral'),
      ],
    },
    { code: 'ESCLERAS', label: 'Escleras', normal: 'escleras anictéricas', findings: [f('ICTERICIA', 'Ictericia escleral')] },
  ],
}

const EAR_FINDINGS = [
  f('CERUMEN', 'Cerumen impactado'), f('OTORREA', 'Otorrea'), f('MT_ERITEMATOSA', 'MT eritematosa'), f('MT_ABOMBADA', 'MT abombada'),
  f('MT_PERFORADA', 'MT perforada'), f('MT_RETRAIDA', 'MT retraída'), f('SIN_CONO', 'Cono luminoso ausente'), f('OTITIS_EXTERNA', 'Otitis externa'),
]

export const ORL: SystemConfig = {
  code: 'ORL',
  label: 'Oídos, nariz y garganta',
  elements: [],
  subsections: [
    {
      code: 'OIDOS',
      label: 'Oídos',
      elements: [
        { code: 'CAE', label: 'Conductos auditivos externos', normal: 'Conductos auditivos externos permeables bilateralmente', paired: true, findings: EAR_FINDINGS },
        { code: 'MT', label: 'Membranas timpánicas', normal: 'Membranas timpánicas íntegras, gris perladas, con cono luminoso normal', paired: true, findings: EAR_FINDINGS },
      ],
    },
    {
      code: 'NARIZ',
      label: 'Nariz',
      elements: [
        { code: 'MUCOSA_NASAL', label: 'Mucosa', normal: 'Mucosa rosada y húmeda', findings: [f('CONGESTION', 'Congestión')] },
        { code: 'TABIQUE', label: 'Tabique', normal: 'tabique nasal centrado', findings: [f('DESVIACION', 'Desviación septal', [side()])] },
        {
          code: 'SECRECION_NASAL',
          label: 'Secreción/congestión',
          normal: 'sin congestión, rinorrea ni pólipos',
          findings: [f('RINORREA', 'Rinorrea', [select('tipo', 'Tipo', ['Hialina', 'Mucosa', 'Purulenta', 'Hemática'])]), f('POLIPOS', 'Pólipos'), f('EPISTAXIS', 'Epistaxis')],
        },
      ],
    },
    {
      code: 'BOCA',
      label: 'Boca y faringe',
      elements: [
        { code: 'MUCOSAS_ORALES', label: 'Mucosas/hidratación', normal: 'Mucosas húmedas y bien hidratadas', findings: [f('MUCOSAS_SECAS', 'Mucosas secas')] },
        { code: 'DENTICION', label: 'Dentición', normal: 'Buena dentición', findings: [f('CARIES', 'Caries/piezas ausentes')] },
        {
          code: 'OROFARINGE',
          label: 'Orofaringe/amígdalas',
          normal: 'Orofaringe permeable, sin eritema, exudados amigdalinos ni lesiones',
          findings: [
            f('ERITEMA_FARINGEO', 'Eritema faríngeo'), f('EXUDADO', 'Exudado amigdalino'),
            f('HIPERTROFIA', 'Hipertrofia amigdalina', [select('grado', 'Grado', SCALES.tonsils)]),
            f('LESION_ORAL', 'Lesión oral', [select('tipo', 'Tipo', ['Úlcera', 'Placa'])]),
          ],
        },
      ],
    },
  ],
}

export const CUELLO: SystemConfig = {
  code: 'CUELLO',
  label: 'Cuello',
  elements: [
    { code: 'MOVILIDAD', label: 'Movilidad/simetría', normal: 'Móvil, simétrico, sin dolor a los movimientos', findings: [f('RIGIDEZ_NUCA', 'Rigidez de nuca')] },
    { code: 'TRAQUEA', label: 'Tráquea', normal: 'Tráquea centrada', findings: [f('TRAQUEA_DESVIADA', 'Tráquea desviada', [side()])] },
    {
      code: 'TIROIDES',
      label: 'Tiroides',
      normal: 'Tiroides no palpable o de tamaño y consistencia normal, sin nódulos ni bocio',
      findings: [f('BOCIO', 'Bocio', [select('grado', 'Grado', ['I', 'II', 'III'])]), f('NODULO', 'Nódulo tiroideo', [side(), number('tamano', 'Tamaño', 'cm')])],
    },
    {
      code: 'GANGLIOS_CERVICALES',
      label: 'Ganglios cervicales',
      normal: 'Sin adenopatías cervicales palpables',
      paired: true,
      sharedWith: { system: 'HEMATOLOGICO', element: 'GANGLIOS_CERVICALES' },
      findings: [f('ADENOPATIA', 'Adenopatía cervical', ADENOPATHY_ATTRIBUTES)],
    },
    { code: 'YUGULARES', label: 'Yugulares', normal: 'Sin ingurgitación yugular', findings: [f('INGURGITACION', 'Ingurgitación yugular', [number('cm', 'Altura', 'cm')])] },
    { code: 'CAROTIDAS', label: 'Carótidas', normal: 'sin soplos carotídeos', paired: true, findings: [f('SOPLO_CAROTIDEO', 'Soplo carotídeo')] },
  ],
}


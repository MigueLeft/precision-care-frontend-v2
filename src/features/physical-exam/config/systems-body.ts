import type { SystemConfig } from '../types'
import { ADENOPATHY_ATTRIBUTES, finding as f, number, select, side, text } from './scales'

// Sistemas 9–11: musculoesquelético, piel y anexos, hematológico/linfático.

const JOINT = select('articulacion', 'Articulación', ['Hombro', 'Codo', 'Muñeca', 'Mano', 'Cadera', 'Rodilla', 'Tobillo', 'Pie'])

export const MUSCULOESQUELETICO: SystemConfig = {
  code: 'MUSCULOESQUELETICO',
  label: 'Musculoesquelético',
  elements: [
    { code: 'MARCHA', label: 'Marcha y postura', normal: 'Marcha y postura normales y estables', findings: [f('ANTIALGICA', 'Marcha antiálgica'), f('CLAUDICANTE', 'Marcha claudicante')] },
    {
      code: 'COLUMNA',
      label: 'Columna',
      normal: 'Columna vertebral alineada y no dolorosa',
      findings: [
        f('ESCOLIOSIS', 'Escoliosis/cifosis'),
        f('DOLOR_COLUMNA', 'Dolor a la palpación de columna', [select('nivel', 'Nivel', ['Cervical', 'Dorsal', 'Lumbar', 'Sacra'])]),
      ],
    },
    {
      code: 'ARTICULACIONES',
      label: 'Articulaciones/extremidades',
      normal: 'Arcos de movilidad articular completos en todas las articulaciones principales. Sin dolor articular, eritema, calor ni deformidades',
      findings: [
        f('LIMITACION', 'Limitación de arcos de movilidad', [JOINT, side()]),
        f('DOLOR_ARTICULAR', 'Dolor articular', [JOINT, side()]),
        f('DERRAME', 'Tumefacción/derrame', [JOINT, side()]),
        f('ERITEMA_CALOR', 'Eritema/calor', [JOINT, side()]),
        f('DEFORMIDAD', 'Deformidad', [JOINT, side()]),
      ],
    },
    { code: 'TONO', label: 'Tono y masa muscular', normal: 'Tono y masa muscular conservados', findings: [f('ATROFIA', 'Atrofia', [text('localizacion', 'Localización')])] },
    {
      code: 'FUERZA',
      label: 'Fuerza',
      normal: 'fuerza muscular 5/5 en cuatro extremidades',
      control: 'strength',
      sharedWith: { system: 'NEUROLOGICO', element: 'FUERZA' },
      findings: [],
    },
  ],
}

export const PIEL: SystemConfig = {
  code: 'PIEL',
  label: 'Piel y anexos',
  elements: [
    {
      code: 'PIEL',
      label: 'Piel',
      normal: 'Piel tibia, seca, elástica, con turgencia e hidratación conservadas',
      findings: [f('PALIDEZ', 'Palidez'), f('ICTERICIA_PIEL', 'Ictericia'), f('CIANOSIS', 'Cianosis', [select('tipo', 'Tipo', ['Central', 'Periférica'])]), f('TURGENCIA', 'Turgencia disminuida')],
    },
    {
      code: 'LESIONES',
      label: 'Lesiones',
      normal: 'Sin exantemas, erupciones sospechosas, úlceras ni nevus anormales',
      findings: [
        f('EXANTEMA', 'Exantema', [select('tipo', 'Tipo', ['Macular', 'Papular', 'Vesicular']), text('distribucion', 'Distribución')]),
        f('ULCERA', 'Úlcera', [text('localizacion', 'Localización'), number('tamano', 'Tamaño', 'cm'), select('estadio', 'Estadio', ['I', 'II', 'III', 'IV'])]),
        f('NEVUS', 'Nevus atípico'),
        f('HERIDA', 'Herida', [text('localizacion', 'Localización')]),
      ],
    },
    { code: 'PELO', label: 'Pelo', normal: 'Pelo con distribución y características normales', findings: [f('ALOPECIA', 'Alopecia')] },
    { code: 'UNAS', label: 'Uñas', normal: 'Uñas normales, sin cianosis ni acropaquia', findings: [f('ACROPAQUIA', 'Acropaquia'), f('ONICOMICOSIS', 'Onicomicosis')] },
  ],
}

const chain = (code: string, label: string, chainName: string, shared?: boolean) => ({
  code,
  label,
  normal: `Sin adenopatías ${chainName} palpables`,
  paired: true,
  lymphChain: chainName,
  ...(shared ? { sharedWith: { system: 'CUELLO', element: 'GANGLIOS_CERVICALES' } } : {}),
  findings: [f('ADENOPATIA', 'Adenopatía', [...ADENOPATHY_ATTRIBUTES, select('conglomerado', 'Conglomerado', ['Sí', 'No'])])],
})

export const HEMATOLOGICO: SystemConfig = {
  code: 'HEMATOLOGICO',
  label: 'Hematológico / Linfático',
  elements: [
    chain('GANGLIOS_CERVICALES', 'Ganglios cervicales', 'cervicales', true),
    chain('GANGLIOS_SUPRACLAVICULARES', 'Ganglios supraclaviculares', 'supraclaviculares'),
    chain('GANGLIOS_AXILARES', 'Ganglios axilares', 'axilares'),
    chain('GANGLIOS_INGUINALES', 'Ganglios inguinales', 'inguinales'),
    {
      code: 'HEMORRAGIAS',
      label: 'Hemorragias cutáneas',
      normal: 'Sin petequias, equimosis ni hematomas espontáneos',
      findings: [f('PETEQUIAS', 'Petequias'), f('PURPURA', 'Púrpura'), f('EQUIMOSIS', 'Equimosis', [text('distribucion', 'Distribución')]), f('HEMATOMAS', 'Hematomas espontáneos')],
    },
  ],
}

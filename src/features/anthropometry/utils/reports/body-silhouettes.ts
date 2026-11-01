// Siluetas del reporte de composición corporal (mujer / hombre), dibujadas en
// una caja de 140 × 470. Se describe el contorno de la mitad derecha de la
// figura y se refleja; las curvas se suavizan (Catmull-Rom → Bézier).

type Point = [number, number]

export const SILHOUETTE_WIDTH = 140
export const SILHOUETTE_HEIGHT = 470
const CENTER = SILHOUETTE_WIDTH / 2

// Mitad derecha de la figura (lado izquierdo del paciente), del cuello al
// entrepierna, en sentido horario.
const FEMALE_HALF: Point[] = [
  [79, 70], [80, 84], [96, 90], [112, 96], [120, 110], [123, 140], [126, 180], [130, 214],
  [133, 240], [132, 252], [126, 257], [121, 249], [118, 224], [114, 190], [110, 160],
  [109, 176], [105, 194], [106, 210], [113, 234], [119, 262], [119, 290], [116, 324],
  [112, 362], [111, 400], [109, 440], [108, 454], [99, 460], [91, 455], [90, 430],
  [89, 384], [86, 336], [78, 304], [70, 296],
]

const MALE_HALF: Point[] = [
  [79, 70], [80, 82], [100, 88], [118, 95], [126, 110], [128, 140], [131, 180], [135, 214],
  [138, 240], [138, 253], [131, 260], [125, 250], [122, 222], [118, 184], [114, 150],
  [112, 168], [110, 200], [110, 232], [112, 256], [112, 280], [111, 318], [108, 356],
  [108, 400], [106, 438], [110, 452], [102, 459], [92, 455], [90, 432], [90, 384],
  [88, 334], [80, 296], [70, 284],
]

const HEADS = {
  female: { cx: CENTER, cy: 38, rx: 25, ry: 33 },
  male: { cx: CENTER, cy: 38, rx: 25, ry: 31 },
}

// Contorno completo: mitad derecha y su reflejo (de abajo hacia arriba).
function fullOutline(half: Point[]): Point[] {
  const mirrored = [...half].reverse().map(([x, y]): Point => [2 * CENTER - x, y])
  return [...half, ...mirrored.slice(1)]
}

// Curva cerrada suave que pasa por todos los puntos.
function smoothClosedPath(points: Point[]): string {
  const n = points.length
  const at = (i: number) => points[(i + n) % n]
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`
  }
  return `${d} Z`
}

export type Sex = 'male' | 'female'

// Puntos de cada segmento sobre la figura (para las líneas a los recuadros).
// "right" es el lado derecho del paciente, que se ve a la izquierda.
export const SEGMENT_ANCHORS: Record<Sex, Record<'rightArm' | 'leftArm' | 'torso' | 'rightLeg' | 'leftLeg', Point>> = {
  female: { rightArm: [20, 200], leftArm: [120, 200], torso: [70, 165], rightLeg: [55, 368], leftLeg: [85, 368] },
  male: { rightArm: [14, 200], leftArm: [126, 200], torso: [70, 160], rightLeg: [52, 368], leftLeg: [88, 368] },
}

// SVG de la figura (cuerpo + cabeza) con los colores del reporte.
export function silhouetteSvg(sex: Sex, fill: string, stroke: string): string {
  const head = HEADS[sex]
  const body = smoothClosedPath(fullOutline(sex === 'male' ? MALE_HALF : FEMALE_HALF))
  return `<path d="${body}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
    <ellipse cx="${head.cx}" cy="${head.cy}" rx="${head.rx}" ry="${head.ry}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`
}

import { formatNumber } from '@/utils/parse-numeric'

interface ResultLike {
  name: string | null
  destinationField: string | null
  score: string
  interpretation: string | null
}

// Nombre del score: el del mapeo; si no tiene (versiones anteriores), el
// campo destino.
export function getResultName(result: Pick<ResultLike, 'name' | 'destinationField'>): string {
  return result.name ?? result.destinationField ?? 'Resultado'
}

// El puntaje solo se muestra si es numérico y distinto de 0; los resultados
// que solo aportan una interpretación se muestran sin número.
export function getResultScoreText(result: Pick<ResultLike, 'score'>): string | null {
  const score = Number(result.score)
  return Number.isNaN(score) || score === 0 ? null : formatNumber(result.score, 0)
}

// Un resultado se omite del resumen cuando no tiene interpretación ni puntaje.
export function isInformativeResult(result: Pick<ResultLike, 'score' | 'interpretation'>): boolean {
  return Boolean(result.interpretation) || getResultScoreText(result) !== null
}

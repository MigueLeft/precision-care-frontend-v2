import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import type { FindriscResult, GloboriskAssessment, RiskCalculation, RiskProfileResult } from '../types'

const KIND_LABELS = { findrisc: 'FINDRISC', globorisk: 'Globorisk', risk_profile: 'Perfil de factores' } as const

// Valor numérico para la tendencia (null si no hay puntaje).
function numeric(calc: RiskCalculation): number | null {
  if (calc.kind === 'findrisc') {
    const r = calc.result as FindriscResult
    return r.status === 'complete' ? r.score : null
  }
  if (calc.kind === 'globorisk') {
    const r = calc.result as GloboriskAssessment
    return r.status === 'calculated' ? r.risk * 100 : null
  }
  return (calc.result as RiskProfileResult).majorAltered
}

function display(calc: RiskCalculation): string {
  if (calc.kind === 'findrisc') {
    const r = calc.result as FindriscResult
    if (r.status === 'not_applicable') return 'No aplica'
    return r.status === 'complete' ? `${r.score} pts` : `${r.range[0]}–${r.range[1]} (incompleto)`
  }
  if (calc.kind === 'globorisk') {
    const r = calc.result as GloboriskAssessment
    return r.status === 'calculated' ? `${(r.risk * 100).toFixed(1)} % (${r.version}, ${r.baseYear})` : 'No calculado'
  }
  return `${(calc.result as RiskProfileResult).majorAltered} mayores alterados`
}

// Histórico de cálculos con la tendencia frente al cálculo anterior del mismo tipo.
export function RiskTrend({ calculations }: { calculations: RiskCalculation[] }) {
  if (calculations.length === 0) {
    return <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Sin cálculos todavía.</Typography>
  }
  // Viene del más reciente al más antiguo: el "anterior" es el siguiente del mismo tipo.
  const previousOf = (index: number) =>
    calculations.slice(index + 1).find((c) => c.kind === calculations[index].kind)

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Fecha</TableCell>
          <TableCell>Cálculo</TableCell>
          <TableCell>Resultado</TableCell>
          <TableCell>Tendencia</TableCell>
          <TableCell>Versión</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {calculations.map((calc, index) => {
          const now = numeric(calc)
          const prev = previousOf(index)
          const before = prev ? numeric(prev) : null
          const trend = now === null || before === null ? '—' : now > before ? '▲' : now < before ? '▼' : '='
          return (
            <TableRow key={calc.id}>
              <TableCell>{formatShortDate(calc.createdAt)}</TableCell>
              <TableCell>{KIND_LABELS[calc.kind]}</TableCell>
              <TableCell>{display(calc)}</TableCell>
              <TableCell sx={{ color: trend === '▲' ? 'error.main' : trend === '▼' ? 'success.main' : 'text.secondary' }}>
                {trend}
              </TableCell>
              <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>{calc.algorithmVersion}</TableCell>
              <TableCell>
                <Chip size="small" variant="outlined" label={calc.supersededAt ? 'Superado' : 'Vigente'} color={calc.supersededAt ? 'default' : 'primary'} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

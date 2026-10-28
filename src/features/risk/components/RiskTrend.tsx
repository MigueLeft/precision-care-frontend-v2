import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import type { RiskCalculation } from '../types'
import { CALCULATION_KIND_LABELS } from '../utils/cardio-labels'
import { calculationText, calculationValue } from '../utils/calculation-values'

// Histórico de cálculos con la tendencia frente al cálculo anterior del mismo tipo.
type RiskTrendProps = {
  calculations: RiskCalculation[]
  page?: number
  rowsPerPage?: number
}

export function RiskTrend({ calculations, page = 0, rowsPerPage = calculations.length }: RiskTrendProps) {
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
        {calculations.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((calc, pageIndex) => {
          const index = page * rowsPerPage + pageIndex
          const now = calculationValue(calc)
          const prev = previousOf(index)
          const before = prev ? calculationValue(prev) : null
          const trend = now === null || before === null ? '—' : now > before ? '▲' : now < before ? '▼' : '='
          return (
            <TableRow key={calc.id}>
              <TableCell>{formatShortDate(calc.createdAt)}</TableCell>
              <TableCell>{CALCULATION_KIND_LABELS[calc.kind]}</TableCell>
              <TableCell>{calculationText(calc)}</TableCell>
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

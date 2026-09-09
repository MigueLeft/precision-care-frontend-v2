import { TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber, toNumber } from '@/utils/parse-numeric'
import { GENERAL_PARAMS } from '../config'
import { getSegment } from '../utils/body-composition-helpers'
import type { BodyComposition } from '../types'

interface BodyCompositionHistoryTableProps {
  compositions: BodyComposition[]
  highlightId?: number
}

// Resuelve el valor "general" de una medición (mezcla campos de la tabla y del
// segmento total).
function generalValue(composition: BodyComposition, key: string): number | null {
  const total = getSegment(composition, 'total')
  switch (key) {
    case 'totalFatPct':
      return toNumber(total?.fatMassPct ?? null)
    case 'totalFatKg':
      return toNumber(total?.fatMassKg ?? null)
    case 'totalLeanKg':
      return toNumber(total?.leanMassKg ?? null)
    default:
      return toNumber((composition as unknown as Record<string, string | null>)[key] ?? null)
  }
}

export function BodyCompositionHistoryTable({
  compositions,
  highlightId,
}: BodyCompositionHistoryTableProps) {
  if (compositions.length === 0) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
        Sin mediciones anteriores.
      </Typography>
    )
  }

  return (
    <DataTable minWidth={160 + compositions.length * 90}>
      <TableHead>
        <TableRow>
          <HeadCell sx={{ minWidth: 160 }}>Parámetro</HeadCell>
          <HeadCell>Unidad</HeadCell>
          {compositions.map((composition) => (
            <HeadCell
              key={composition.id}
              align="right"
              sx={{ color: composition.id === highlightId ? 'primary.main' : 'grey.700' }}
            >
              {formatShortDate(composition.assessmentDate)}
            </HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {GENERAL_PARAMS.filter((param) => param.key !== 'heightCm').map((param) => (
          <TableRow key={param.key}>
            <DataCell>{param.label}</DataCell>
            <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
            {compositions.map((composition) => (
              <DataCell
                key={composition.id}
                align="right"
                calc={param.calc}
                sx={{ fontWeight: composition.id === highlightId ? 700 : undefined }}
              >
                {formatNumber(generalValue(composition, param.key))}
              </DataCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  )
}

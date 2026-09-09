import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
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
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700', minWidth: 160 }}>
              Parámetro
            </TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Unidad</TableCell>
            {compositions.map((composition) => (
              <TableCell
                key={composition.id}
                align="right"
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: composition.id === highlightId ? 'primary.main' : 'grey.700',
                }}
              >
                {formatShortDate(composition.assessmentDate)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {GENERAL_PARAMS.filter((param) => param.key !== 'heightCm').map((param) => (
            <TableRow key={param.key}>
              <TableCell sx={{ fontSize: '13px' }}>{param.label}</TableCell>
              <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</TableCell>
              {compositions.map((composition) => (
                <TableCell
                  key={composition.id}
                  align="right"
                  sx={{
                    fontSize: '13px',
                    fontWeight: composition.id === highlightId ? 700 : 400,
                  }}
                >
                  {formatNumber(generalValue(composition, param.key))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

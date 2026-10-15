import { Fragment } from 'react'
import { TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber } from '@/utils/parse-numeric'
import { ANTHROPOMETRY_GROUPS } from '../config'
import { anthropometryValues } from '../utils/anthropometry-calculations'
import type { Anthropometry } from '../types'
import { ParamLabel } from './ParamLabel'

type AnthropometryHistoryTableProps = {
  rows: Anthropometry[]
  // Medición a resaltar (la de la consulta actual).
  highlightId?: number
}

// Histórico tipo hoja de cálculo: una columna por medición, agrupado por apartado.
export function AnthropometryHistoryTable({ rows, highlightId }: AnthropometryHistoryTableProps) {
  if (rows.length === 0) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
        Sin mediciones anteriores.
      </Typography>
    )
  }

  const values = rows.map(anthropometryValues)
  const isHighlight = (row: Anthropometry) => row.id === highlightId

  return (
    <DataTable minWidth={240 + rows.length * 90}>
      <TableHead>
        <TableRow>
          <HeadCell sx={{ minWidth: 200 }}>Parámetro</HeadCell>
          <HeadCell>Unidad</HeadCell>
          {rows.map((row) => (
            <HeadCell
              key={row.id}
              align="right"
              sx={{ color: isHighlight(row) ? 'primary.main' : 'grey.700' }}
            >
              {formatShortDate(row.assessmentDate)}
            </HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {ANTHROPOMETRY_GROUPS.map((group) => (
          <Fragment key={group.id}>
            <TableRow>
              <DataCell
                colSpan={2 + rows.length}
                sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}
              >
                {group.title.toUpperCase()}
              </DataCell>
            </TableRow>
            {group.params.map((param) => (
              <TableRow key={param.key}>
                <DataCell>
                  <ParamLabel param={param} />
                </DataCell>
                <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
                {rows.map((row, index) => (
                  <DataCell
                    key={row.id}
                    align="right"
                    calc={param.calc}
                    sx={{ fontWeight: isHighlight(row) ? 700 : undefined }}
                  >
                    {formatNumber(values[index][param.key] ?? null, param.decimals)}
                  </DataCell>
                ))}
              </TableRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </DataTable>
  )
}

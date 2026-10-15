import { Box, TableBody, TableHead, TableRow } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatNumber, truncateTo } from '@/utils/parse-numeric'
import type { AnthropometryGroup, AnthropometryParam } from '../config'
import type { ValueMap } from '../utils/anthropometry-calculations'
import { ParamLabel } from './ParamLabel'

type AnthropometryValuesTableProps = {
  group: AnthropometryGroup
  current: ValueMap
  previous: ValueMap | undefined
}

function deltaColor(param: AnthropometryParam, delta: number): string {
  if (delta === 0 || !param.betterWhen) return 'text.secondary'
  const improved = param.betterWhen === 'lower' ? delta < 0 : delta > 0
  return improved ? 'success.main' : 'error.main'
}

// Valores de un apartado con el cambio respecto a la medición anterior.
export function AnthropometryValuesTable({ group, current, previous }: AnthropometryValuesTableProps) {
  return (
    <DataTable minWidth={380}>
      <TableHead>
        <TableRow>
          <HeadCell>{group.title}</HeadCell>
          <HeadCell>Unidad</HeadCell>
          <HeadCell align="right">Valor</HeadCell>
          <HeadCell align="right">Δ vs. anterior</HeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {group.params.map((param) => {
          const value = current[param.key]
          const prev = previous?.[param.key]
          const decimals = param.decimals ?? 1
          const delta =
            value !== undefined && prev !== undefined ? truncateTo(value - prev, decimals) : null
          return (
            <TableRow key={param.key}>
              <DataCell>
                <ParamLabel param={param} />
              </DataCell>
              <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
              <DataCell align="right" calc={param.calc}>
                {formatNumber(value ?? null, decimals)}
              </DataCell>
              <DataCell align="right">
                {delta === null || delta === 0 ? (
                  '—'
                ) : (
                  <Box component="span" sx={{ color: deltaColor(param, delta) }}>
                    {delta > 0 ? `+${delta}` : delta}
                  </Box>
                )}
              </DataCell>
            </TableRow>
          )
        })}
      </TableBody>
    </DataTable>
  )
}

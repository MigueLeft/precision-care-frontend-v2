import { TableBody, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatNumber } from '@/utils/parse-numeric'
import type { AnthropometryGroup } from '../config'
import type { ValueMap } from '../utils/anthropometry-calculations'
import { ParamLabel } from './ParamLabel'

type AnthropometryGroupInputsProps = {
  group: AnthropometryGroup
  raw: Record<string, string>
  computed: ValueMap
  // Valores de la medición anterior (columna "Anterior"); se omite si no hay.
  previous?: ValueMap
  readOnly: boolean
  onChange: (key: string, value: string) => void
}

// Captura de un apartado (composición, circunferencias, fuerza, signos, pliegues).
export function AnthropometryGroupInputs({
  group,
  raw,
  computed,
  previous,
  readOnly,
  onChange,
}: AnthropometryGroupInputsProps) {
  return (
    <>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
        {group.title.toUpperCase()}
      </Typography>
      <DataTable minWidth={previous ? 420 : 340}>
        <TableHead>
          <TableRow>
            <HeadCell>Parámetro</HeadCell>
            <HeadCell>Unidad</HeadCell>
            <HeadCell align="right">Valor</HeadCell>
            {previous && <HeadCell align="right">Anterior</HeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {group.params.map((param) => (
            <TableRow key={param.key}>
              <DataCell>
                <ParamLabel param={param} />
              </DataCell>
              <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
              <DataCell align="right" calc={param.calc} sx={{ width: 110 }}>
                {param.calc ? (
                  formatNumber(computed[param.key] ?? null, param.decimals)
                ) : (
                  <TextField
                    size="small"
                    type="number"
                    value={raw[param.key] ?? ''}
                    onChange={(event) => onChange(param.key, event.target.value)}
                    disabled={readOnly}
                    sx={{ width: 90 }}
                  />
                )}
              </DataCell>
              {previous && (
                <DataCell align="right" sx={{ color: 'text.secondary' }}>
                  {formatNumber(previous[param.key] ?? null, param.decimals)}
                </DataCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </>
  )
}

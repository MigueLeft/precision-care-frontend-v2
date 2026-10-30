import { InputBase, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber } from '@/utils/parse-numeric'
import type { AnthropometryGroup } from '../config'
import type { ValueMap } from '../utils/anthropometry-calculations'
import type { AnthropometryHistoryColumn } from '../utils/history-columns'
import { SHEET_INPUT_CLASS, handleSheetKeyDown } from '../utils/sheet-navigation'
import { ParamLabel } from './ParamLabel'

type AnthropometryGroupInputsProps = {
  group: AnthropometryGroup
  raw: Record<string, string>
  computed: ValueMap
  // Mediciones anteriores, de la más vieja a la más nueva (se omiten si no hay).
  history: AnthropometryHistoryColumn[]
  readOnly: boolean
  // Con composición por segmento, las filas "calcWithSegments" se calculan.
  segmentsEnabled: boolean
  onChange: (key: string, value: string) => void
}

const VALUE_WIDTH = 96

// Captura de un apartado como hoja de cálculo: parámetro con su unidad, las
// mediciones anteriores y la celda de esta consulta a la derecha.
export function AnthropometryGroupInputs({
  group,
  raw,
  computed,
  history,
  readOnly,
  segmentsEnabled,
  onChange,
}: AnthropometryGroupInputsProps) {
  const isCalc = (param: AnthropometryGroup['params'][number]) =>
    !!param.calc || (!!param.calcWithSegments && segmentsEnabled)

  return (
    <>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
        {group.title.toUpperCase()}
      </Typography>
      <DataTable minWidth={260 + (history.length + 1) * VALUE_WIDTH}>
        <TableHead>
          <TableRow>
            <HeadCell>Parámetro</HeadCell>
            {history.map((column) => (
              <HeadCell key={column.id} align="right" sx={{ width: VALUE_WIDTH, color: 'grey.700' }}>
                {formatShortDate(column.date)}
              </HeadCell>
            ))}
            <HeadCell align="right" sx={{ width: VALUE_WIDTH + 16, color: 'primary.main' }}>
              Esta consulta
            </HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {group.params.map((param) => (
            <TableRow key={param.key}>
              <DataCell>
                <ParamLabel param={{ label: param.label, calc: isCalc(param) }} />
                {param.unit && (
                  <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 0.75 }}>
                    {param.unit}
                  </Typography>
                )}
              </DataCell>
              {history.map((column) => (
                <DataCell key={column.id} align="right" sx={{ color: 'text.secondary' }}>
                  {formatNumber(column.values[param.key] ?? null, param.decimals)}
                </DataCell>
              ))}
              <DataCell
                align="right"
                calc={isCalc(param)}
                sx={{ p: isCalc(param) ? undefined : 0, '&:focus-within': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}
              >
                {isCalc(param) ? (
                  formatNumber(computed[param.key] ?? null, param.decimals)
                ) : (
                  <InputBase
                    type="number"
                    value={raw[param.key] ?? ''}
                    onChange={(event) => onChange(param.key, event.target.value)}
                    disabled={readOnly}
                    slotProps={{ input: { className: SHEET_INPUT_CLASS, 'aria-label': `${param.label} ${param.unit}`, onKeyDown: handleSheetKeyDown } }}
                    sx={{ width: '100%', px: 1, fontSize: '13px', '& input': { textAlign: 'right', py: 0.75 } }}
                  />
                )}
              </DataCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </>
  )
}

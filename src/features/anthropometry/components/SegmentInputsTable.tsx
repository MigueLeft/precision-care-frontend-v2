import { TableBody, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatNumber } from '@/utils/parse-numeric'
import { SEGMENTS, SEGMENT_LABELS, SEGMENT_PARAMS } from '../segment-config'
import { segmentField } from '../hooks/useAnthropometryForm'
import { segmentSkeletalKg } from '../utils/anthropometry-calculations'
import { ParamLabel } from './ParamLabel'

type SegmentInputsTableProps = {
  raw: Record<string, string>
  readOnly: boolean
  onChange: (field: string, value: string) => void
}

const parse = (raw: string | undefined) =>
  raw !== undefined && raw.trim() !== '' ? Number(raw) : undefined

// Composición por segmento (brazos, piernas y tronco). La masa músculo
// esquelética se calcula de la masa magra de cada segmento.
export function SegmentInputsTable({ raw, readOnly, onChange }: SegmentInputsTableProps) {
  return (
    <>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
        COMPOSICIÓN POR SEGMENTO
      </Typography>
      <DataTable minWidth={180 + SEGMENTS.length * 110}>
        <TableHead>
          <TableRow>
            <HeadCell>Parámetro</HeadCell>
            <HeadCell>Unidad</HeadCell>
            {SEGMENTS.map((segment) => (
              <HeadCell key={segment}>{SEGMENT_LABELS[segment]}</HeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {SEGMENT_PARAMS.map((param) => (
            <TableRow key={param.key}>
              <DataCell>
                <ParamLabel param={param} />
              </DataCell>
              <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
              {SEGMENTS.map((segment) => (
                <DataCell key={segment} calc={param.calc}>
                  {param.calc ? (
                    formatNumber(
                      segmentSkeletalKg(parse(raw[segmentField(segment, 'leanMassKg')])) ?? null,
                    )
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      value={raw[segmentField(segment, param.key)] ?? ''}
                      onChange={(event) =>
                        onChange(segmentField(segment, param.key), event.target.value)
                      }
                      disabled={readOnly}
                      sx={{ width: 90 }}
                    />
                  )}
                </DataCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </>
  )
}

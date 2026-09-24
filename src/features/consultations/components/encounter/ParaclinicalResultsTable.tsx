import { IconButton, TableBody, TableHead, TableRow } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import {
  PARACLINICAL_VALUE_STATUS_COLORS,
  formatReferenceRange,
  type ParaclinicalResultValue,
} from '@/features/paraclinical'
import { formatShortDate } from '@/utils/format-date'

export interface ParaclinicalRow {
  rowId: string
  resultId: number
  rootCategoryId: number | null
  date: string
  value: ParaclinicalResultValue
}

interface ParaclinicalResultsTableProps {
  rows: ParaclinicalRow[]
  readOnly: boolean
  onRemove: (resultId: number) => void
}

export function ParaclinicalResultsTable({ rows, readOnly, onRemove }: ParaclinicalResultsTableProps) {
  return (
    <DataTable minWidth={640}>
      <TableHead>
        <TableRow>
          {['Estudio', 'Resultado', 'Unidad', 'Referencia', 'Fecha', ''].map((h) => (
            <HeadCell key={h}>{h}</HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => {
          const status = row.value.status
          return (
            <TableRow key={row.rowId}>
              <DataCell>{row.value.paraclinicalName ?? '—'}</DataCell>
              <DataCell
                sx={{
                  fontWeight: 700,
                  color:
                    status && status !== 'normal'
                      ? `${PARACLINICAL_VALUE_STATUS_COLORS[status]}.main`
                      : undefined,
                }}
              >
                {row.value.numericValue ?? row.value.textValue ?? '—'}
              </DataCell>
              <DataCell sx={{ color: 'text.secondary' }}>{row.value.unit ?? '—'}</DataCell>
              <DataCell sx={{ color: 'text.secondary' }}>{formatReferenceRange(row.value)}</DataCell>
              <DataCell sx={{ color: 'text.secondary' }}>{formatShortDate(row.date)}</DataCell>
              <DataCell align="right">
                {!readOnly && (
                  <IconButton size="small" aria-label="Quitar resultado" onClick={() => onRemove(row.resultId)}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </DataCell>
            </TableRow>
          )
        })}
      </TableBody>
    </DataTable>
  )
}

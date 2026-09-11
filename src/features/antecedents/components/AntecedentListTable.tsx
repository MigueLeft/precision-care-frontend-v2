import { Chip, IconButton, Stack, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { EmptyState } from '@/components/EmptyState'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import type { Antecedent } from '../types'
import {
  ANTECEDENT_STATUS_COLORS,
  ANTECEDENT_STATUS_LABELS,
  formatEventDate,
} from '../utils/antecedent-format'

interface AntecedentListTableProps {
  antecedents: Antecedent[]
  variant: 'family' | 'personal'
  onEdit?: (antecedent: Antecedent) => void
  onDelete: (antecedent: Antecedent) => void
}

function Condition({ antecedent }: { antecedent: Antecedent }) {
  return (
    <>
      {antecedent.name}
      {antecedent.cie10Code && (
        <Typography component="span" sx={{ ml: 1, fontSize: '11px', color: 'text.secondary' }}>
          ({antecedent.cie10Code})
        </Typography>
      )}
    </>
  )
}

export function AntecedentListTable({
  antecedents,
  variant,
  onEdit,
  onDelete,
}: AntecedentListTableProps) {
  if (antecedents.length === 0) {
    return <EmptyState message="Sin registros." />
  }

  const headers =
    variant === 'family'
      ? ['Familiar', 'Condición / CIE-10', 'Notas', '']
      : ['Condición', 'Desde', 'Estado', 'Notas', '']

  return (
    <DataTable minWidth={560}>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <HeadCell key={`${header}-${index}`}>{header}</HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {antecedents.map((antecedent) => (
          <TableRow key={antecedent.id}>
            {variant === 'family' ? (
              <>
                <DataCell sx={{ fontWeight: 600 }}>{antecedent.relationship ?? '—'}</DataCell>
                <DataCell>
                  <Condition antecedent={antecedent} />
                </DataCell>
              </>
            ) : (
              <DataCell sx={{ fontWeight: 600 }}>
                <Condition antecedent={antecedent} />
              </DataCell>
            )}
            {variant === 'personal' && (
              <DataCell sx={{ color: 'text.secondary' }}>
                {formatEventDate(antecedent.eventDate)}
              </DataCell>
            )}
            {variant === 'personal' && (
              <DataCell>
                {antecedent.status ? (
                  <Chip
                    label={ANTECEDENT_STATUS_LABELS[antecedent.status]}
                    size="small"
                    color={ANTECEDENT_STATUS_COLORS[antecedent.status]}
                    variant="outlined"
                  />
                ) : (
                  '—'
                )}
              </DataCell>
            )}
            <DataCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              {antecedent.description ?? '—'}
            </DataCell>
            <DataCell align="right">
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                {onEdit && (
                  <IconButton size="small" onClick={() => onEdit(antecedent)} aria-label="Editar">
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                <IconButton size="small" onClick={() => onDelete(antecedent)} aria-label="Eliminar">
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
            </DataCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  )
}

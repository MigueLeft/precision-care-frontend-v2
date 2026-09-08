import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { EmptyState } from '@/components/EmptyState'
import type { Antecedent } from '../types'
import {
  ANTECEDENT_STATUS_COLORS,
  ANTECEDENT_STATUS_LABELS,
  formatEventDate,
} from '../utils/antecedent-format'

interface AntecedentListTableProps {
  antecedents: Antecedent[]
  variant: 'family' | 'personal'
  onEdit: (antecedent: Antecedent) => void
  onDelete: (antecedent: Antecedent) => void
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

  const secondColumn = variant === 'family' ? 'Parentesco' : 'Desde'

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {['Condición', secondColumn, ...(variant === 'personal' ? ['Estado'] : []), 'Notas', ''].map(
              (header, index) => (
                <TableCell
                  key={`${header}-${index}`}
                  sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}
                >
                  {header}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {antecedents.map((antecedent) => (
            <TableRow key={antecedent.id}>
              <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                {antecedent.name}
                {antecedent.cie10Code && (
                  <Typography component="span" sx={{ ml: 1, fontSize: '11px', color: 'text.secondary' }}>
                    ({antecedent.cie10Code})
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ fontSize: '13px' }}>
                {variant === 'family'
                  ? (antecedent.relationship ?? '—')
                  : formatEventDate(antecedent.eventDate)}
              </TableCell>
              {variant === 'personal' && (
                <TableCell>
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
                </TableCell>
              )}
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
                {antecedent.description ?? '—'}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={() => onEdit(antecedent)} aria-label="Editar">
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(antecedent)} aria-label="Eliminar">
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

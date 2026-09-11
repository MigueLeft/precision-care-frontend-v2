import { useState } from 'react'
import {
  Chip,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { AppButton } from '@/components/AppButton'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatShortDate } from '@/utils/format-date'
import type { ParaclinicalResult } from '../types'
import {
  PARACLINICAL_VALUE_STATUS_COLORS,
  PARACLINICAL_VALUE_STATUS_LABELS,
  formatReferenceRange,
} from '../utils/paraclinical-helpers'

interface ParaclinicalResultCardProps {
  result: ParaclinicalResult
  onRemove?: () => void
}

export function ParaclinicalResultCard({ result, onRemove }: ParaclinicalResultCardProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Stack
        direction="row"
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          cursor: 'pointer',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ExpandMoreIcon
            sx={{
              color: 'text.secondary',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms',
            }}
          />
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
            {result.laboratory ?? 'Resultado de paraclínico'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(result.resultDate)}
          </Typography>
          <Chip
            label={result.values.length > 0 ? 'Con resultados' : 'Sin resultados'}
            size="small"
            color={result.values.length > 0 ? 'success' : 'default'}
            variant="outlined"
          />
          <AppButton size="small" variant="outlined" disabled>
            PDF
          </AppButton>
          {onRemove && (
            <IconButton
              size="small"
              aria-label="Eliminar resultado"
              onClick={(event) => {
                event.stopPropagation()
                onRemove()
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Collapse in={expanded} unmountOnExit>
        <DataTable>
          <TableHead>
            <TableRow>
              {['Analito', 'Resultado', 'Unidad', 'Referencia', 'Estado'].map((h) => (
                <HeadCell key={h}>{h}</HeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {result.values.map((value, index) => (
              <TableRow key={`${value.paraclinicalCatalogId}-${index}`}>
                <DataCell>{value.paraclinicalName ?? '—'}</DataCell>
                <DataCell sx={{ fontWeight: 600 }}>
                  {value.numericValue ?? value.textValue ?? '—'}
                </DataCell>
                <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {value.unit ?? '—'}
                </DataCell>
                <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {formatReferenceRange(value)}
                </DataCell>
                <DataCell>
                  {value.status && (
                    <Chip
                      label={PARACLINICAL_VALUE_STATUS_LABELS[value.status]}
                      size="small"
                      color={PARACLINICAL_VALUE_STATUS_COLORS[value.status]}
                      variant="outlined"
                    />
                  )}
                </DataCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Collapse>
    </Paper>
  )
}

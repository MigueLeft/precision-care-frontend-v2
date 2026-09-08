import { useState } from 'react'
import {
  Box,
  Chip,
  Collapse,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import type { ParaclinicalResult } from '../types'
import {
  PARACLINICAL_VALUE_STATUS_COLORS,
  PARACLINICAL_VALUE_STATUS_LABELS,
  formatReferenceRange,
} from '../utils/paraclinical-helpers'

interface ParaclinicalResultCardProps {
  result: ParaclinicalResult
}

export function ParaclinicalResultCard({ result }: ParaclinicalResultCardProps) {
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
        </Stack>
      </Stack>

      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Analito', 'Resultado', 'Unidad', 'Referencia', 'Estado'].map((h) => (
                  <TableCell key={h} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.values.map((value, index) => (
                <TableRow key={`${value.paraclinicalCatalogId}-${index}`}>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {value.paraclinicalName ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {value.numericValue ?? value.textValue ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {value.unit ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {formatReferenceRange(value)}
                  </TableCell>
                  <TableCell>
                    {value.status && (
                      <Chip
                        label={PARACLINICAL_VALUE_STATUS_LABELS[value.status]}
                        size="small"
                        color={PARACLINICAL_VALUE_STATUS_COLORS[value.status]}
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </Paper>
  )
}

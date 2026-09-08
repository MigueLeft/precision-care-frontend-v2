import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { SectionCard } from '@/components/ui/SectionCard'
import { EmptyState } from '@/components/EmptyState'
import {
  useParaclinicalResultsByPatient,
  getLatestAnalytes,
  formatReferenceRange,
  PARACLINICAL_VALUE_STATUS_LABELS,
  PARACLINICAL_VALUE_STATUS_COLORS,
} from '@/features/paraclinical'
import { formatShortDate } from '../../utils/clinical-format'

interface UltimosLaboratoriosCardProps {
  patientId: number
}

export function UltimosLaboratoriosCard({ patientId }: UltimosLaboratoriosCardProps) {
  const { data = [], isLoading } = useParaclinicalResultsByPatient(patientId)
  const analytes = getLatestAnalytes(data, 6)

  return (
    <SectionCard
      title="Últimos laboratorios"
      action={
        <Link
          to="/pacientes/$patientId/paraclinicos"
          params={{ patientId: String(patientId) }}
          style={{ textDecoration: 'none' }}
        >
          <Typography sx={{ fontSize: '13px', color: 'primary.main', fontWeight: 600 }}>
            Ver todos
          </Typography>
        </Link>
      }
      disableBodyPadding
    >
      {!isLoading && analytes.length === 0 && (
        <Box sx={{ p: 3 }}>
          <EmptyState message="Sin resultados de laboratorio." />
        </Box>
      )}

      {analytes.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Paraclínico', 'Resultado', 'Referencia', 'Estado', 'Fecha'].map((h) => (
                  <TableCell key={h} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {analytes.map((analyte, index) => (
                <TableRow key={`${analyte.paraclinicalCatalogId}-${index}`}>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {analyte.paraclinicalName ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {analyte.numericValue ?? analyte.textValue ?? '—'}
                    {analyte.unit ? ` ${analyte.unit}` : ''}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {formatReferenceRange(analyte)}
                  </TableCell>
                  <TableCell>
                    {analyte.status && (
                      <Chip
                        label={PARACLINICAL_VALUE_STATUS_LABELS[analyte.status]}
                        size="small"
                        color={PARACLINICAL_VALUE_STATUS_COLORS[analyte.status]}
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {formatShortDate(analyte.resultDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </SectionCard>
  )
}

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber } from '@/utils/parse-numeric'
import { PHYSICAL_EXAM_PARAMS, computePhysicalExam } from '../config'
import type { PhysicalExam } from '../types'

interface PhysicalExamHistoryTableProps {
  exams: PhysicalExam[]
  // id del examen a resaltar (columna de la consulta actual).
  highlightId?: number
}

export function PhysicalExamHistoryTable({ exams, highlightId }: PhysicalExamHistoryTableProps) {
  if (exams.length === 0) {
    return (
      <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
        Sin exámenes físicos anteriores.
      </Typography>
    )
  }

  const computed = exams.map((exam) => computePhysicalExam(exam.measurements ?? {}))

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700', minWidth: 180 }}>
              Parámetro
            </TableCell>
            <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Unidad</TableCell>
            {exams.map((exam) => (
              <TableCell
                key={exam.id}
                align="right"
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: exam.id === highlightId ? 'primary.main' : 'grey.700',
                }}
              >
                {formatShortDate(exam.examDate)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {PHYSICAL_EXAM_PARAMS.map((param) => (
            <TableRow key={param.key}>
              <TableCell sx={{ fontSize: '13px' }}>
                {param.label}
                {param.calc && (
                  <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
                    calc.
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</TableCell>
              {computed.map((values, index) => (
                <TableCell
                  key={exams[index].id}
                  align="right"
                  sx={{
                    fontSize: '13px',
                    fontWeight: exams[index].id === highlightId ? 700 : 400,
                    color: param.calc ? 'primary.main' : 'text.primary',
                  }}
                >
                  {formatNumber(values[param.key] ?? null)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

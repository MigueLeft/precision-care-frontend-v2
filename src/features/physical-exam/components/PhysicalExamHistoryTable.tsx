import { TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
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
    <DataTable minWidth={120 + exams.length * 90}>
      <TableHead>
        <TableRow>
          <HeadCell sx={{ minWidth: 180 }}>Parámetro</HeadCell>
          <HeadCell>Unidad</HeadCell>
          {exams.map((exam) => (
            <HeadCell
              key={exam.id}
              align="right"
              sx={{ color: exam.id === highlightId ? 'primary.main' : 'grey.700' }}
            >
              {formatShortDate(exam.examDate)}
            </HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {PHYSICAL_EXAM_PARAMS.map((param) => (
          <TableRow key={param.key}>
            <DataCell>
              {param.label}
              {param.calc && (
                <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
                  calc.
                </Typography>
              )}
            </DataCell>
            <DataCell sx={{ color: 'text.secondary', fontSize: '12px' }}>{param.unit}</DataCell>
            {computed.map((values, index) => (
              <DataCell
                key={exams[index].id}
                align="right"
                calc={param.calc}
                sx={{
                  fontWeight: exams[index].id === highlightId ? 700 : undefined,
                }}
              >
                {formatNumber(values[param.key] ?? null)}
              </DataCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  )
}

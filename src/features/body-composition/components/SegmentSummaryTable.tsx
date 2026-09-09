import { TableBody, TableHead, TableRow } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { formatNumber } from '@/utils/parse-numeric'
import type { BodyCompositionSegment } from '../types'
import { BODY_SEGMENT_LABELS } from '../utils/body-composition-helpers'

interface SegmentSummaryTableProps {
  segments: BodyCompositionSegment[]
}

const SEGMENT_ORDER: BodyCompositionSegment['segment'][] = [
  'total',
  'torso',
  'left_arm',
  'right_arm',
  'left_leg',
  'right_leg',
]

const COLUMNS = ['Segmento', 'Grasa %', 'Grasa kg', 'Magra kg', 'Musc. esq.', 'Prevista']

export function SegmentSummaryTable({ segments }: SegmentSummaryTableProps) {
  const ordered = SEGMENT_ORDER.map((key) =>
    segments.find((s) => s.segment === key),
  ).filter((s): s is BodyCompositionSegment => Boolean(s))

  return (
    <DataTable minWidth={520}>
      <TableHead>
        <TableRow>
          {COLUMNS.map((header) => (
            <HeadCell key={header}>{header}</HeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {ordered.map((segment) => {
          const isTotal = segment.segment === 'total'
          return (
            <TableRow key={segment.id} sx={isTotal ? { bgcolor: '#f8fafc' } : undefined}>
              <DataCell sx={{ fontWeight: 600 }}>
                {BODY_SEGMENT_LABELS[segment.segment]}
              </DataCell>
              <DataCell>{formatNumber(segment.fatMassPct)}%</DataCell>
              <DataCell>{formatNumber(segment.fatMassKg)}</DataCell>
              <DataCell>{formatNumber(segment.leanMassKg)}</DataCell>
              <DataCell calc>{formatNumber(segment.skeletalMuscleMassKg)}</DataCell>
              <DataCell sx={{ color: 'text.secondary' }}>
                {formatNumber(segment.predictedMuscleMassKg)}
              </DataCell>
            </TableRow>
          )
        })}
      </TableBody>
    </DataTable>
  )
}

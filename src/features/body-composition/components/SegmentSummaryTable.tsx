import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
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

export function SegmentSummaryTable({ segments }: SegmentSummaryTableProps) {
  const ordered = SEGMENT_ORDER.map((key) =>
    segments.find((s) => s.segment === key),
  ).filter((s): s is BodyCompositionSegment => Boolean(s))

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {['Segmento', 'Grasa %', 'Grasa kg', 'Magra %', 'Magra kg', 'Musc. esq.', 'Prevista'].map(
              (h) => (
                <TableCell key={h} sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>
                  {h}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {ordered.map((segment) => (
            <TableRow key={segment.id} sx={segment.segment === 'total' ? { bgcolor: 'grey.50' } : undefined}>
              <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                {BODY_SEGMENT_LABELS[segment.segment]}
              </TableCell>
              <TableCell sx={{ fontSize: '13px' }}>{formatNumber(segment.fatMassPct)}%</TableCell>
              <TableCell sx={{ fontSize: '13px' }}>{formatNumber(segment.fatMassKg)}</TableCell>
              <TableCell sx={{ fontSize: '13px' }}>{formatNumber(segment.leanMassPct)}%</TableCell>
              <TableCell sx={{ fontSize: '13px' }}>{formatNumber(segment.leanMassKg)}</TableCell>
              <TableCell sx={{ fontSize: '13px' }}>
                {formatNumber(segment.skeletalMuscleMassKg)}
              </TableCell>
              <TableCell sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {formatNumber(segment.predictedMuscleMassKg)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

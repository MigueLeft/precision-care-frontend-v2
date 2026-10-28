import { Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { PreventOutcome, PreventResult } from '../types'
import {
  ASCVD_CATEGORY_COLORS,
  ASCVD_CATEGORY_LABELS,
  PREVENT_OUTCOME_LABELS,
  percent,
} from '../utils/cardio-labels'
import { LegacyPceComparison } from './LegacyPceComparison'
import { WarningList } from './WarningList'

const OUTCOMES: PreventOutcome[] = ['total_cvd', 'ascvd', 'heart_failure']
const cell = { fontSize: '12px', py: 0.5 }

type PreventCardProps = {
  result: PreventResult
  patientId: number
}

// PREVENT (AHA): comparativo; el score principal para Venezuela es Globorisk.
export function PreventCard({ result, patientId }: PreventCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>PREVENT (AHA) · comparativo</Typography>
        {result.status === 'calculated' ? (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={cell}>Desenlace</TableCell>
                  <TableCell sx={cell} align="right">10 años</TableCell>
                  <TableCell sx={cell} align="right">30 años</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OUTCOMES.map((outcome) => (
                  <TableRow key={outcome}>
                    <TableCell sx={cell}>{PREVENT_OUTCOME_LABELS[outcome]}</TableCell>
                    <TableCell sx={{ ...cell, fontWeight: 600 }} align="right">{percent(result.risk10yr[outcome])}</TableCell>
                    <TableCell sx={cell} align="right">{result.risk30yr ? percent(result.risk30yr[outcome]) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {result.ascvd10yrCategory && (
                <Chip
                  size="small"
                  label={`ASCVD 10 años: ${ASCVD_CATEGORY_LABELS[result.ascvd10yrCategory]}`}
                  color={ASCVD_CATEGORY_COLORS[result.ascvd10yrCategory]}
                />
              )}
              {result.bpDrugThresholdMet && (
                <Chip size="small" variant="outlined" color="warning" label="ECV ≥7,5 %: umbral de fármacos en HTA estadio 1" />
              )}
            </Stack>
            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{result.attribution}</Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{result.reason}</Typography>
        )}
        <WarningList warnings={result.warnings} />
        <LegacyPceComparison patientId={patientId} />
      </Stack>
    </Paper>
  )
}

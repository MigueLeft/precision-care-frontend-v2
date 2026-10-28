import { Alert, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { PreventOutcome, PreventResult } from '../types'
import {
  ASCVD_CATEGORY_COLORS,
  ASCVD_CATEGORY_LABELS,
  PREVENT_OUTCOME_LABELS,
  percent,
  splitNotes,
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
// Se calcula aunque la población no sea de EE. UU. (la nota es informativa).
export function PreventCard({ result, patientId }: PreventCardProps) {
  const { warnings, notes } = splitNotes(result.warnings)
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
            <WarningList warnings={warnings} />
            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
              {[result.attribution, ...notes].join(' ')}
            </Typography>
          </>
        ) : (
          <>
            {/* El motivo es lo que impide el cálculo (edad, datos faltantes, prevención secundaria). */}
            <Alert severity="info" sx={{ py: 0, '& .MuiAlert-message': { fontSize: '12px' } }}>
              {result.reason}
            </Alert>
            <WarningList warnings={warnings} />
          </>
        )}
        <LegacyPceComparison patientId={patientId} />
      </Stack>
    </Paper>
  )
}

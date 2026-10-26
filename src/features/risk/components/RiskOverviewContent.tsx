import { Grid, Stack, Typography } from '@mui/material'
import type { RiskOverview } from '../types'
import { RISK_DISCLAIMER } from '../utils/risk-labels'
import { FindriscCard } from './FindriscCard'
import { GloboriskCard } from './GloboriskCard'
import { RiskFindings } from './RiskFindings'
import { RiskReferralAlert } from './RiskReferralAlert'

type RiskOverviewContentProps = {
  overview: RiskOverview
  consultationId: number | null
  readOnly: boolean
  // Formulario de confirmación (solo en la consulta).
  children?: React.ReactNode
}

// Resultados vigentes: FINDRISC, Globorisk, perfil de factores y la leyenda.
export function RiskOverviewContent({ overview, consultationId, readOnly, children }: RiskOverviewContentProps) {
  const { findrisc, globorisk, riskProfile } = overview.assessment
  const referral = findrisc.status !== 'not_applicable' && findrisc.referral

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic' }}>{RISK_DISCLAIMER}</Typography>
      {children}
      {referral && (
        <RiskReferralAlert
          consultationId={consultationId}
          threshold={overview.referralThreshold}
          studies={overview.referralStudies}
          readOnly={readOnly}
        />
      )}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: globorisk ? 6 : 12 }}>
          <FindriscCard result={findrisc} />
        </Grid>
        {globorisk && (
          <Grid size={{ xs: 12, md: 6 }}>
            <GloboriskCard result={globorisk} />
          </Grid>
        )}
      </Grid>
      <RiskFindings result={riskProfile} />
    </Stack>
  )
}

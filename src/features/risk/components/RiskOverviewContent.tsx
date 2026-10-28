import { Grid, Stack, Typography } from '@mui/material'
import type { RiskOverview } from '../types'
import { RISK_DISCLAIMER } from '../utils/risk-labels'
import { Cha2ds2Card } from './Cha2ds2Card'
import { FindriscCard } from './FindriscCard'
import { GloboriskCard } from './GloboriskCard'
import { PreventCard } from './PreventCard'
import { RiskFindings } from './RiskFindings'
import { RiskReferralAlert } from './RiskReferralAlert'

type RiskOverviewContentProps = {
  overview: RiskOverview
  patientId: number
  consultationId: number | null
  readOnly: boolean
  // Formulario de confirmación (solo en la consulta).
  children?: React.ReactNode
}

// Resultados vigentes: FINDRISC, Globorisk (principal), PREVENT (comparativo
// AHA), CHA2DS2 si hay FA, perfil de factores y la leyenda.
export function RiskOverviewContent({ overview, patientId, consultationId, readOnly, children }: RiskOverviewContentProps) {
  const { findrisc, globorisk, riskProfile, prevent } = overview.assessment
  const referral = findrisc.status !== 'not_applicable' && findrisc.referral
  const hasAtrialFibrillation = overview.profile.atrialFibrillation?.value === true

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
        <Grid size={{ xs: 12, md: hasAtrialFibrillation ? 6 : 12 }}>
          <PreventCard result={prevent} patientId={patientId} />
        </Grid>
        {hasAtrialFibrillation && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Cha2ds2Card patientId={patientId} />
          </Grid>
        )}
      </Grid>
      <RiskFindings result={riskProfile} />
    </Stack>
  )
}

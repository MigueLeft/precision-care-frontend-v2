import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import { CLINICAL_RISK_SCORE_LABELS, riskTone } from '../utils/lifestyle-format'

export interface ClinicalRiskScoreItem {
  destinationField: string
  score: string
  interpretation: string | null
}

interface ClinicalRiskScoresCardProps {
  scores: ClinicalRiskScoreItem[]
}

// Desglose de los scores del ingresable IM1 que no son uno de los 8
// componentes de Life's Essential 8 (educación, nivel socioeconómico,
// antecedentes familiares, apnea del sueño, ansiedad, depresión, alcohol,
// tabaquismo, drogas...).
export function ClinicalRiskScoresCard({ scores }: ClinicalRiskScoresCardProps) {
  const items = scores.filter((item) => item.destinationField in CLINICAL_RISK_SCORE_LABELS)
  if (items.length === 0) return null

  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
        Otros indicadores del ingresable
      </Typography>
      <Grid container spacing={1.5}>
        {items.map((item) => (
          <Grid key={item.destinationField} size={{ xs: 12, sm: 6 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 1,
              }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                {CLINICAL_RISK_SCORE_LABELS[item.destinationField]}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                color={riskTone(item.interpretation) ?? 'default'}
                label={item.interpretation ?? item.score}
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

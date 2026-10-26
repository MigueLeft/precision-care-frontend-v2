import { Button, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { AppButton } from '@/components/AppButton'

type ExamToolbarProps = {
  documented: number
  total: number
  pendingMandatory: number
  warnings: number
  readOnly: boolean
  onAllNormal: () => void
  onReview: () => void
}

// "Todo normal", progreso (X de 13 documentados) y avisos.
export function ExamToolbar({ documented, total, pendingMandatory, warnings, readOnly, onAllNormal, onReview }: ExamToolbarProps) {
  return (
    <Stack spacing={1} sx={{ mb: 1.5 }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {!readOnly && (
          <AppButton
            size="small"
            variant="outlined"
            color="success"
            startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
            onClick={onAllNormal}
          >
            Todo normal
          </AppButton>
        )}
        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
          {documented} de {total} documentados
        </Typography>
        {pendingMandatory > 0 && (
          <Chip size="small" color="warning" variant="outlined" label={`${pendingMandatory} obligatorios pendientes`} />
        )}
        {warnings > 0 && (
          <Button size="small" color="warning" startIcon={<WarningAmberIcon sx={{ fontSize: 16 }} />} onClick={onReview} sx={{ ml: 'auto', textTransform: 'none' }}>
            {warnings} {warnings === 1 ? 'aviso' : 'avisos'} · revisar
          </Button>
        )}
      </Stack>
      <LinearProgress variant="determinate" value={(documented / total) * 100} sx={{ height: 4, borderRadius: 2 }} />
      {!readOnly && (
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
          "Todo normal" deja todos los sistemas en Normal y borra lo que hayas marcado antes.
        </Typography>
      )}
    </Stack>
  )
}

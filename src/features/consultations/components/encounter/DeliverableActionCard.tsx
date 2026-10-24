import { ButtonBase, Paper, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

type DeliverableActionCardProps = {
  icon: SvgIconComponent
  title: string
  subtitle: string
  disabled?: boolean
  onClick: () => void
}

// Tarjeta de "Generar entregables" (receta, orden, reportes…).
export function DeliverableActionCard({ icon: Icon, title, subtitle, disabled = false, onClick }: DeliverableActionCardProps) {
  return (
    <ButtonBase disabled={disabled} onClick={onClick} sx={{ borderRadius: '8px', textAlign: 'left', display: 'block' }}>
      <Paper
        sx={{
          p: 1.5,
          borderRadius: '8px',
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled ? undefined : { borderColor: 'primary.main' },
        }}
      >
        <Icon sx={{ color: disabled ? 'text.secondary' : 'primary.main' }} />
        <div>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{title}</Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{subtitle}</Typography>
        </div>
      </Paper>
    </ButtonBase>
  )
}

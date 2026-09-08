import { Paper, Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

const ITEMS: { icon: SvgIconComponent; title: string; subtitle: string }[] = [
  {
    icon: ReceiptLongOutlinedIcon,
    title: 'Receta médica',
    subtitle: 'Genera receta con las prescripciones actuales',
  },
  {
    icon: ScienceOutlinedIcon,
    title: 'Orden de laboratorio',
    subtitle: 'Seleccionar paraclínicos a ordenar',
  },
  {
    icon: DescriptionOutlinedIcon,
    title: 'Reporte de consulta',
    subtitle: 'Resumen clínico de esta consulta',
  },
]

export function GenerarEntregablesPanel() {
  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        Generar entregables
      </Typography>
      <Stack spacing={1}>
        {ITEMS.map((item) => (
          <Paper
            key={item.title}
            sx={{
              p: 1.5,
              borderRadius: '8px',
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              opacity: 0.6,
            }}
          >
            <item.icon sx={{ color: 'text.secondary' }} />
            <div>
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                {item.subtitle}
              </Typography>
            </div>
          </Paper>
        ))}
      </Stack>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Los entregables se generan como PDF. Firma manual posterior a la impresión. (Próximamente)
      </Typography>
    </div>
  )
}

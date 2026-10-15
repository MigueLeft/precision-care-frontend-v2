import { useState } from 'react'
import { ButtonBase, Paper, Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { LabOrderDialog } from '../deliverables/LabOrderDialog'
import { PrescriptionDialog } from '../deliverables/PrescriptionDialog'

type DialogKind = 'prescription' | 'lab_order'

const ITEMS: { kind: DialogKind | null; icon: SvgIconComponent; title: string; subtitle: string }[] = [
  {
    kind: 'prescription',
    icon: ReceiptLongOutlinedIcon,
    title: 'Receta médica',
    subtitle: 'Elige los medicamentos del tratamiento a recetar',
  },
  {
    kind: 'lab_order',
    icon: ScienceOutlinedIcon,
    title: 'Orden de laboratorio',
    subtitle: 'Selecciona estudios o perfiles a ordenar',
  },
  {
    kind: null,
    icon: DescriptionOutlinedIcon,
    title: 'Reporte de consulta',
    subtitle: 'Resumen clínico de esta consulta (próximamente)',
  },
]

type GenerarEntregablesPanelProps = {
  consultationId: number
  readOnly: boolean
}

// Entregables de la consulta: se preparan en un modal y se imprimen. La primera
// impresión (o una con cambios) queda registrada en el expediente.
export function GenerarEntregablesPanel({ consultationId, readOnly }: GenerarEntregablesPanelProps) {
  const [open, setOpen] = useState<DialogKind | null>(null)

  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>Generar entregables</Typography>
      <Stack spacing={1}>
        {ITEMS.map((item) => (
          <ButtonBase
            key={item.title}
            disabled={!item.kind}
            onClick={() => item.kind && setOpen(item.kind)}
            sx={{ borderRadius: '8px', textAlign: 'left', display: 'block' }}
          >
            <Paper
              sx={{
                p: 1.5,
                borderRadius: '8px',
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                opacity: item.kind ? 1 : 0.6,
                '&:hover': item.kind ? { borderColor: 'primary.main' } : undefined,
              }}
            >
              <item.icon sx={{ color: item.kind ? 'primary.main' : 'text.secondary' }} />
              <div>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                  {item.subtitle}
                </Typography>
              </div>
            </Paper>
          </ButtonBase>
        ))}
      </Stack>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Lo que prepares queda en espera dentro de la consulta y se registra en el expediente al
        imprimir o al finalizar la consulta.
      </Typography>

      <PrescriptionDialog
        consultationId={consultationId}
        readOnly={readOnly}
        open={open === 'prescription'}
        onClose={() => setOpen(null)}
      />
      <LabOrderDialog
        consultationId={consultationId}
        readOnly={readOnly}
        open={open === 'lab_order'}
        onClose={() => setOpen(null)}
      />
    </div>
  )
}

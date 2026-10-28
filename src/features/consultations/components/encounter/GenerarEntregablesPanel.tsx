import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { ConsultationStudyOrdersDialog } from '@/features/deliverables'
import { LabOrderDialog } from '../deliverables/LabOrderDialog'
import { PrescriptionDialog } from '../deliverables/PrescriptionDialog'
import { AnthropometryReportCards } from './AnthropometryReportCards'
import { DeliverableActionCard } from './DeliverableActionCard'

type DialogKind = 'prescription' | 'lab_order' | 'study_orders'

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
    kind: 'study_orders',
    icon: MonitorHeartOutlinedIcon,
    title: 'Órdenes de estudio',
    subtitle: 'Eco, radiografía y otros estudios dirigidos a un centro',
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
  patientId: number
  readOnly: boolean
}

// Entregables de la consulta: receta y orden se preparan en un modal (la
// primera impresión, o una con cambios, queda registrada en el expediente);
// los reportes de antropometría se imprimen directo.
export function GenerarEntregablesPanel({ consultationId, patientId, readOnly }: GenerarEntregablesPanelProps) {
  const [open, setOpen] = useState<DialogKind | null>(null)

  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>Generar entregables</Typography>
      <Stack spacing={1}>
        {ITEMS.map((item) => (
          <DeliverableActionCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            disabled={!item.kind}
            onClick={() => item.kind && setOpen(item.kind)}
          />
        ))}
        <AnthropometryReportCards consultationId={consultationId} patientId={patientId} />
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
      <ConsultationStudyOrdersDialog
        consultationId={consultationId}
        patientId={patientId}
        readOnly={readOnly}
        open={open === 'study_orders'}
        onClose={() => setOpen(null)}
      />
    </div>
  )
}

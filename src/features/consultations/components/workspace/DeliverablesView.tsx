import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { ConsultationStudyOrdersDialog } from '@/features/deliverables'
import { LabOrderDialog } from '../deliverables/LabOrderDialog'
import { PrescriptionDialog } from '../deliverables/PrescriptionDialog'
import { AnthropometryReportCards } from '../encounter/AnthropometryReportCards'
import { DeliverableActionCard } from '../encounter/DeliverableActionCard'
import { BoardHeader } from './BoardHeader'

type DeliverableKind = 'prescription' | 'lab_order' | 'study_orders'

const ITEMS: { kind: DeliverableKind | null; icon: SvgIconComponent; title: string; subtitle: string }[] = [
  { kind: 'prescription', icon: ReceiptLongOutlinedIcon, title: 'Receta médica', subtitle: 'Elige los medicamentos del tratamiento a recetar' },
  { kind: 'lab_order', icon: ScienceOutlinedIcon, title: 'Orden de laboratorio', subtitle: 'Selecciona estudios o perfiles a ordenar' },
  { kind: 'study_orders', icon: MonitorHeartOutlinedIcon, title: 'Órdenes de estudio', subtitle: 'Eco, radiografía y otros estudios dirigidos a un centro' },
  { kind: null, icon: DescriptionOutlinedIcon, title: 'Reporte de consulta', subtitle: 'Resumen clínico de esta consulta (próximamente)' },
]

type DeliverablesViewProps = {
  consultationId: number
  patientId: number
  readOnly: boolean
}

// Entregables en el panel central: al elegir uno, su formulario reemplaza la
// lista (en vez de abrirse en un modal). "Cerrar" vuelve a la lista.
export function DeliverablesView({ consultationId, patientId, readOnly }: DeliverablesViewProps) {
  const [open, setOpen] = useState<DeliverableKind | null>(null)
  const close = () => setOpen(null)

  return (
    <div>
      {open === null && (
        <>
          <BoardHeader title="Entregables" />
          <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
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
          </Box>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <AnthropometryReportCards consultationId={consultationId} patientId={patientId} />
          </Stack>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
            Lo que prepares queda en espera dentro de la consulta y se registra en el expediente al
            imprimir o al finalizar la consulta.
          </Typography>
        </>
      )}

      <PrescriptionDialog inline consultationId={consultationId} readOnly={readOnly} open={open === 'prescription'} onClose={close} />
      <LabOrderDialog inline consultationId={consultationId} readOnly={readOnly} open={open === 'lab_order'} onClose={close} />
      <ConsultationStudyOrdersDialog
        inline
        consultationId={consultationId}
        patientId={patientId}
        readOnly={readOnly}
        open={open === 'study_orders'}
        onClose={close}
      />
    </div>
  )
}

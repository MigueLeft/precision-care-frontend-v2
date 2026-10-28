import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { DELIVERABLE_TYPE_LABELS } from '../utils/deliverable-format'
import { printDeliverable, type PrintableDeliverable } from '../utils/print-deliverable'
import type { Deliverable, LabOrderData, PrescriptionData, StudyOrderData } from '../types'

// Orden, receta y orden de estudio guardan su contenido en `data`; se puede
// reimprimir tal cual (la reimpresión desde el expediente no crea otro registro).
function printable(deliverable: Deliverable): PrintableDeliverable | null {
  const data = deliverable.data as { items?: unknown }
  if (!Array.isArray(data.items)) return null
  switch (deliverable.type) {
    case 'lab_order':
      return { type: 'lab_order', data: data as unknown as LabOrderData }
    case 'prescription':
      return { type: 'prescription', data: data as unknown as PrescriptionData }
    case 'study_order':
      return { type: 'study_order', data: data as unknown as StudyOrderData }
    default:
      return null
  }
}

// Título y destinatario: perfil de la orden de laboratorio o centro de la orden de estudio.
function detail(item: PrintableDeliverable) {
  if (item.type === 'lab_order') return item.data.title ?? null
  if (item.type === 'study_order') return item.data.referralProvider?.name ?? null
  return null
}

const ICONS = { lab_order: ScienceOutlinedIcon, prescription: ReceiptLongOutlinedIcon, study_order: MonitorHeartOutlinedIcon }

type DeliverableCardProps = {
  deliverable: Deliverable
  // Editar la orden de estudio creada desde el expediente.
  onEditStudyOrder?: (studyOrderId: number) => void
}

export function DeliverableCard({ deliverable, onEditStudyOrder }: DeliverableCardProps) {
  const item = printable(deliverable)
  const Icon = item ? ICONS[item.type] : DescriptionOutlinedIcon
  const subtitle = item ? detail(item) : null
  const editableOrder =
    item?.type === 'study_order' && deliverable.consultationId === null && onEditStudyOrder ? item.data.studyOrderId : null

  return (
    <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Icon sx={{ color: 'primary.main', mt: 0.25 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
              {deliverable.templateName ?? 'Entregable'}
              {subtitle ? ` — ${subtitle}` : ''}
            </Typography>
            {deliverable.type && <Chip label={DELIVERABLE_TYPE_LABELS[deliverable.type]} size="small" />}
          </Stack>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.25 }}>
            {formatShortDate(deliverable.generatedAt)}
            {item?.data.specialist.name ? ` · ${item.data.specialist.name}` : ''}
          </Typography>
          {item && (
            <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap', mt: 1 }}>
              {item.data.items.map((line) => (
                <Chip key={line.name} label={line.name} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          {editableOrder !== null && (
            <AppButton
              size="small"
              variant="text"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onEditStudyOrder?.(editableOrder)}
            >
              Editar
            </AppButton>
          )}
          {item && (
            <AppButton
              size="small"
              variant="outlined"
              startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => printDeliverable(item)}
            >
              Imprimir
            </AppButton>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}

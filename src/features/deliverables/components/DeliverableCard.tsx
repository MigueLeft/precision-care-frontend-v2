import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { DELIVERABLE_TYPE_LABELS } from '../utils/deliverable-format'
import { printDeliverable } from '../utils/print-deliverable'
import type { Deliverable, LabOrderData, PrescriptionData } from '../types'

// Orden y receta guardan su contenido en `data`; se puede reimprimir tal cual
// (la reimpresión desde el expediente no crea otro registro).
function orderData(deliverable: Deliverable) {
  const data = deliverable.data as Partial<LabOrderData & PrescriptionData>
  const printable =
    (deliverable.type === 'lab_order' || deliverable.type === 'prescription') &&
    Array.isArray(data.items)
  return printable ? (data as LabOrderData | PrescriptionData) : null
}

const ICONS = { lab_order: ScienceOutlinedIcon, prescription: ReceiptLongOutlinedIcon }

export function DeliverableCard({ deliverable }: { deliverable: Deliverable }) {
  const data = orderData(deliverable)
  const type = deliverable.type === 'lab_order' || deliverable.type === 'prescription' ? deliverable.type : null
  const Icon = type ? ICONS[type] : DescriptionOutlinedIcon

  return (
    <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Icon sx={{ color: 'primary.main', mt: 0.25 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
              {deliverable.templateName ?? 'Entregable'}
            </Typography>
            {deliverable.type && (
              <Chip label={DELIVERABLE_TYPE_LABELS[deliverable.type]} size="small" />
            )}
          </Stack>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.25 }}>
            {formatShortDate(deliverable.generatedAt)}
            {data?.specialist.name ? ` · ${data.specialist.name}` : ''}
          </Typography>
          {data && (
            <Stack direction="row" useFlexGap spacing={0.5} sx={{ flexWrap: 'wrap', mt: 1 }}>
              {data.items.map((item) => (
                <Chip key={item.name} label={item.name} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Box>
        {data && type && (
          <AppButton
            size="small"
            variant="outlined"
            startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() => printDeliverable(type, data)}
          >
            Imprimir
          </AppButton>
        )}
      </Stack>
    </Paper>
  )
}

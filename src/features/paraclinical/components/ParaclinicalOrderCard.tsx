import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import { formatShortDate } from '@/utils/format-date'
import type { ParaclinicalOrder } from '../types'
import {
  PARACLINICAL_ORDER_STATUS_COLORS,
  PARACLINICAL_ORDER_STATUS_LABELS,
} from '../utils/paraclinical-helpers'

interface ParaclinicalOrderCardProps {
  order: ParaclinicalOrder
}

export function ParaclinicalOrderCard({ order }: ParaclinicalOrderCardProps) {
  return (
    <Paper sx={{ borderRadius: '8px', p: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
          Orden #{order.id}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(order.orderDate)}
          </Typography>
          <Chip
            label={PARACLINICAL_ORDER_STATUS_LABELS[order.status]}
            size="small"
            color={PARACLINICAL_ORDER_STATUS_COLORS[order.status]}
            variant="outlined"
          />
        </Stack>
      </Stack>
      <Box sx={{ mt: 1 }}>
        {order.items.map((item, index) => (
          <Typography
            key={`${item.paraclinicalCatalogId}-${index}`}
            sx={{ fontSize: '13px' }}
          >
            • {item.paraclinicalName ?? 'Paraclínico'}
            {item.instructions ? (
              <Box component="span" sx={{ color: 'text.secondary' }}>
                {' '}
                — {item.instructions}
              </Box>
            ) : null}
          </Typography>
        ))}
      </Box>
    </Paper>
  )
}

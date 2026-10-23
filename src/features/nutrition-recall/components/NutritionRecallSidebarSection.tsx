import { useState } from 'react'
import { Paper, Stack, Typography } from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import { formatShortDate } from '@/utils/format-date'
import { useNutritionRecallsByPatient } from '../hooks/useNutritionRecallQueries'
import { NutritionRecallReportDrawer } from './NutritionRecallReportDrawer'
import type { NutritionRecall } from '../types'

type NutritionRecallSidebarSectionProps = {
  patientId: number
}

function statusLabel(recall: NutritionRecall) {
  if (!recall.completed) return 'Pendiente'
  if (recall.reportStatus === 'sent') return 'Reporte enviado'
  return 'Completado · reporte por generar'
}

// Recordatorios de 24 Horas del paciente dentro de la consulta: al abrir uno
// completado se ve la transcripción y se genera/envía el reporte.
export function NutritionRecallSidebarSection({ patientId }: NutritionRecallSidebarSectionProps) {
  const { data: recalls = [] } = useNutritionRecallsByPatient(patientId)
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>Recordatorio de 24 Horas</Typography>
      {recalls.length === 0 ? (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Sin recordatorios enviados.</Typography>
      ) : (
        <Stack spacing={1}>
          {recalls.map((recall) => (
            <Paper
              key={recall.id}
              onClick={() => recall.completed && setOpenId(recall.id)}
              sx={{
                p: 1.25,
                borderRadius: '8px',
                display: 'flex',
                gap: 1.25,
                alignItems: 'center',
                cursor: recall.completed ? 'pointer' : 'default',
                opacity: recall.completed ? 1 : 0.6,
                '&:hover': recall.completed ? { bgcolor: 'action.hover' } : undefined,
              }}
            >
              <RestaurantOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '12.5px', fontWeight: 600 }} noWrap>
                  {formatShortDate(recall.completedAt ?? recall.startAt)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: recall.completed && recall.reportStatus !== 'sent' ? 'warning.main' : 'text.secondary',
                  }}
                >
                  {statusLabel(recall)}
                </Typography>
              </div>
            </Paper>
          ))}
        </Stack>
      )}
      <NutritionRecallReportDrawer recallId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}

import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import { AppButton } from '@/components/AppButton'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { useNutritionRecallsByPatient } from '../hooks/useNutritionRecallQueries'
import { NutritionRecallItem } from './NutritionRecallItem'
import { NutritionRecallReportDrawer } from './NutritionRecallReportDrawer'
import { SendNutritionRecallDialog } from './SendNutritionRecallDialog'

type NutritionRecallsPanelProps = {
  patientId: number
}

// Recordatorios de 24 Horas (NutriBot) del paciente, dentro de su pestaña de
// ingresables.
export function NutritionRecallsPanel({ patientId }: NutritionRecallsPanelProps) {
  const { data: recalls = [], isLoading, isError, error } = useNutritionRecallsByPatient(patientId)
  const [sendOpen, setSendOpen] = useState(false)
  const [reportId, setReportId] = useState<number | null>(null)
  const hasPending = recalls.some((recall) => !recall.completed)

  return (
    <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Recordatorio de 24 Horas</Typography>
          <AppButton
            variant="outlined"
            startIcon={<RestaurantOutlinedIcon sx={{ fontSize: 16 }} />}
            disabled={hasPending}
            onClick={() => setSendOpen(true)}
          >
            Enviar recordatorio
          </AppButton>
        </Stack>

        {recalls.length === 0 && (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            Aún no se le ha enviado un Recordatorio de 24 Horas.
          </Typography>
        )}
        {recalls.map((recall) => (
          <NutritionRecallItem key={recall.id} recall={recall} onViewReport={setReportId} />
        ))}
        {hasPending && (
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            Mientras el recordatorio esté pendiente no se puede enviar otro; puedes copiar su enlace o
            reenviarlo por correo.
          </Typography>
        )}
      </Stack>

      <SendNutritionRecallDialog open={sendOpen} patientId={patientId} onClose={() => setSendOpen(false)} />
      <NutritionRecallReportDrawer recallId={reportId} onClose={() => setReportId(null)} />
    </QueryBoundary>
  )
}
